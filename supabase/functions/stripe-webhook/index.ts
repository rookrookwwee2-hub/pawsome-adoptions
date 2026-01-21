import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getApiSecret } from "../_shared/getApiSecret.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Verify Stripe webhook signature
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const parts = signature.split(",");
    const timestamp = parts.find(p => p.startsWith("t="))?.split("=")[1];
    const v1Signature = parts.find(p => p.startsWith("v1="))?.split("=")[1];

    if (!timestamp || !v1Signature) {
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    return expectedSignature === v1Signature;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = await getApiSecret("STRIPE_WEBHOOK_SECRET");
    const signature = req.headers.get("stripe-signature");
    const payload = await req.text();

    // Verify signature if webhook secret is configured
    if (webhookSecret && signature) {
      const isValid = await verifyStripeSignature(payload, signature, webhookSecret);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const event = JSON.parse(payload);
    console.log("Stripe webhook event:", event.type);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);

        // Update guest_payments status to completed
        if (paymentIntent.metadata?.guest_payment_id) {
          const { error } = await supabase
            .from("guest_payments")
            .update({ 
              status: "completed",
              transaction_hash: paymentIntent.id,
            })
            .eq("id", paymentIntent.metadata.guest_payment_id);

          if (error) {
            console.error("Error updating payment status:", error);
          }
        }

        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment",
          title: "Stripe Payment Received",
          message: `Payment of ${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()} was successful`,
          reference_type: "payment",
          reference_id: paymentIntent.metadata?.guest_payment_id || null,
        });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log("Payment failed:", paymentIntent.id);

        // Update guest_payments status to failed
        if (paymentIntent.metadata?.guest_payment_id) {
          await supabase
            .from("guest_payments")
            .update({ status: "failed" })
            .eq("id", paymentIntent.metadata.guest_payment_id);
        }

        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment",
          title: "Stripe Payment Failed",
          message: `Payment attempt failed: ${paymentIntent.last_payment_error?.message || "Unknown error"}`,
          reference_type: "payment",
        });

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        console.log("Charge refunded:", charge.id);

        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment",
          title: "Stripe Payment Refunded",
          message: `A payment of ${(charge.amount_refunded / 100).toFixed(2)} ${charge.currency.toUpperCase()} was refunded`,
          reference_type: "payment",
        });

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook handler failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
