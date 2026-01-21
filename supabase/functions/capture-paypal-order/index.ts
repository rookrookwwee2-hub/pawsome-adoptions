import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Order ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get PayPal settings from payment_settings table
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: paypalSettings, error: settingsError } = await supabase
      .from("payment_settings")
      .select("setting_value")
      .eq("setting_key", "paypal")
      .single();

    if (settingsError || !paypalSettings) {
      return new Response(
        JSON.stringify({ error: "PayPal is not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const settings = paypalSettings.setting_value as {
      enabled: boolean;
      clientId: string;
      secretKey: string;
      mode: "sandbox" | "live";
      currency: string;
    };

    if (!settings.enabled || !settings.clientId || !settings.secretKey) {
      return new Response(
        JSON.stringify({ error: "PayPal is not enabled or configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine PayPal API base URL
    const baseUrl = settings.mode === "live" 
      ? "https://api-m.paypal.com" 
      : "https://api-m.sandbox.paypal.com";

    // Get OAuth2 access token
    const authString = btoa(`${settings.clientId}:${settings.secretKey}`);
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error("PayPal token error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to authenticate with PayPal" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Capture the PayPal order
    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json().catch(() => ({}));
      console.error("PayPal capture error:", errorData);
      return new Response(
        JSON.stringify({ error: errorData.message || "Failed to capture PayPal payment" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const captureData = await captureResponse.json();

    // If captured successfully, update guest_payments if custom_id exists
    if (captureData.status === "COMPLETED") {
      const purchaseUnit = captureData.purchase_units?.[0];
      const customId = purchaseUnit?.payments?.captures?.[0]?.custom_id;
      
      if (customId) {
        await supabase
          .from("guest_payments")
          .update({ 
            status: "completed",
            transaction_hash: orderId,
          })
          .eq("id", customId);
      }

      // Create admin notification
      const amount = purchaseUnit?.amount?.value || 0;
      const currency = purchaseUnit?.amount?.currency_code || "USD";
      
      await supabase.from("admin_notifications").insert({
        type: "payment",
        title: "PayPal Payment Received",
        message: `PayPal payment of ${amount} ${currency} was successful (Order: ${orderId})`,
        reference_type: "payment",
        reference_id: customId || null,
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        orderId: captureData.id,
        status: captureData.status,
        payer: captureData.payer,
        capture: captureData.purchase_units?.[0]?.payments?.captures?.[0],
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return new Response(
      JSON.stringify({ error: "Failed to capture PayPal payment" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
