import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getApiSecret } from "../_shared/getApiSecret.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, paypal-transmission-id, paypal-transmission-time, paypal-transmission-sig, paypal-cert-url, paypal-auth-algo",
};

interface PayPalSettings {
  enabled: boolean;
  clientId: string;
  secretKey: string;
  email: string;
  mode: "sandbox" | "live";
  currency: string;
}

async function verifyPayPalWebhook(
  req: Request, 
  body: string, 
  supabase: ReturnType<typeof createClient>
): Promise<{ valid: boolean; error?: string }> {
  // Get webhook ID from api_secrets
  const webhookId = await getApiSecret("PAYPAL_WEBHOOK_ID");
  if (!webhookId) {
    console.warn("PAYPAL_WEBHOOK_ID not configured - webhook verification disabled");
    // Return valid if webhook ID is not set (allows gradual rollout)
    // In production, you should return false here after setting up the webhook ID
    return { valid: true, error: "Webhook ID not configured - verification skipped" };
  }

  // Extract PayPal signature headers
  const transmissionId = req.headers.get("paypal-transmission-id");
  const transmissionTime = req.headers.get("paypal-transmission-time");
  const transmissionSig = req.headers.get("paypal-transmission-sig");
  const certUrl = req.headers.get("paypal-cert-url");
  const authAlgo = req.headers.get("paypal-auth-algo");

  if (!transmissionId || !transmissionSig || !transmissionTime || !certUrl || !authAlgo) {
    console.error("Missing PayPal webhook headers");
    return { valid: false, error: "Missing required PayPal webhook headers" };
  }

  // Get PayPal credentials from payment_settings
  const { data: paypalSettingsData, error: settingsError } = await supabase
    .from("payment_settings")
    .select("setting_value")
    .eq("setting_key", "paypal")
    .single();

  if (settingsError || !paypalSettingsData) {
    console.error("Error fetching PayPal settings:", settingsError);
    return { valid: false, error: "Failed to fetch PayPal settings" };
  }

  const settings = paypalSettingsData.setting_value as unknown as PayPalSettings;
  
  if (!settings.clientId || !settings.secretKey) {
    console.error("PayPal credentials not configured");
    return { valid: false, error: "PayPal credentials not configured" };
  }

  const baseUrl = settings.mode === "live" 
    ? "https://api-m.paypal.com" 
    : "https://api-m.sandbox.paypal.com";

  try {
    // Get PayPal access token
    const auth = btoa(`${settings.clientId}:${settings.secretKey}`);
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Failed to get PayPal access token:", errorText);
      return { valid: false, error: "Failed to authenticate with PayPal" };
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Verify webhook signature with PayPal API
    const verifyResponse = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    });

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error("PayPal webhook verification API error:", errorText);
      return { valid: false, error: "PayPal verification API error" };
    }

    const verifyResult = await verifyResponse.json();
    console.log("PayPal verification result:", verifyResult.verification_status);

    if (verifyResult.verification_status === "SUCCESS") {
      return { valid: true };
    } else {
      return { valid: false, error: `Verification failed: ${verifyResult.verification_status}` };
    }
  } catch (error) {
    console.error("PayPal webhook verification error:", error);
    return { valid: false, error: `Verification exception: ${error.message}` };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Read the raw payload for verification
    const payload = await req.text();
    
    // Verify the webhook signature
    const verification = await verifyPayPalWebhook(req, payload, supabase);
    
    if (!verification.valid) {
      console.error("Invalid PayPal webhook signature:", verification.error);
      return new Response(
        JSON.stringify({ error: "Invalid webhook signature", details: verification.error }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const event = JSON.parse(payload);
    console.log("PayPal webhook event:", event.event_type);

    switch (event.event_type) {
      case "CHECKOUT.ORDER.APPROVED": {
        const order = event.resource;
        console.log("Order approved:", order.id);

        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment",
          title: "PayPal Order Approved",
          message: `A PayPal order has been approved and is awaiting capture (Order: ${order.id})`,
          reference_type: "payment",
        });

        break;
      }

      case "PAYMENT.CAPTURE.COMPLETED": {
        const capture = event.resource;
        console.log("Payment captured:", capture.id);

        const customId = capture.custom_id;
        const amount = capture.amount?.value || 0;
        const currency = capture.amount?.currency_code || "USD";

        // Update guest_payments status to completed
        if (customId) {
          const { error } = await supabase
            .from("guest_payments")
            .update({ 
              status: "completed",
              transaction_hash: capture.id,
            })
            .eq("id", customId);

          if (error) {
            console.error("Error updating payment status:", error);
          }
        }

        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment",
          title: "PayPal Payment Completed",
          message: `Payment of ${amount} ${currency} was captured successfully`,
          reference_type: "payment",
          reference_id: customId || null,
        });

        break;
      }

      case "PAYMENT.CAPTURE.DENIED":
      case "PAYMENT.CAPTURE.DECLINED": {
        const capture = event.resource;
        console.log("Payment denied:", capture.id);

        const customId = capture.custom_id;

        // Update guest_payments status to failed
        if (customId) {
          await supabase
            .from("guest_payments")
            .update({ status: "failed" })
            .eq("id", customId);
        }

        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment",
          title: "PayPal Payment Failed",
          message: `A PayPal payment was denied or declined`,
          reference_type: "payment",
        });

        break;
      }

      case "PAYMENT.CAPTURE.REFUNDED": {
        const refund = event.resource;
        console.log("Payment refunded:", refund.id);

        const amount = refund.amount?.value || 0;
        const currency = refund.amount?.currency_code || "USD";

        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment",
          title: "PayPal Payment Refunded",
          message: `A payment of ${amount} ${currency} was refunded`,
          reference_type: "payment",
        });

        break;
      }

      default:
        console.log("Unhandled PayPal event type:", event.event_type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("PayPal webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook handler failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
