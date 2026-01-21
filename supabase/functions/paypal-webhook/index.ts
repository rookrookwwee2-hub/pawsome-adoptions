import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, paypal-transmission-id, paypal-transmission-time, paypal-transmission-sig, paypal-cert-url, paypal-auth-algo",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const event = JSON.parse(payload);
    
    console.log("PayPal webhook event:", event.event_type);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
