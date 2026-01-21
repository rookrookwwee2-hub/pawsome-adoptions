import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, cko-signature",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const event = JSON.parse(body);

    console.log("Checkout.com webhook received:", event.type);

    // Handle different event types
    switch (event.type) {
      case "payment_approved":
      case "payment_captured": {
        const paymentId = event.data?.id;
        const metadata = event.data?.metadata || {};
        const customerEmail = event.data?.customer?.email;
        
        console.log(`Payment ${event.type}:`, paymentId);

        // Update payment status if we have a reference in metadata
        if (metadata.guest_payment_id) {
          const { error: updateError } = await supabase
            .from("guest_payments")
            .update({ 
              status: "completed",
              transaction_hash: paymentId,
            })
            .eq("id", metadata.guest_payment_id);

          if (updateError) {
            console.error("Error updating guest payment:", updateError);
          }
        }

        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment_received",
          title: "Checkout.com Payment Received",
          message: `Payment ${paymentId} was ${event.type === "payment_captured" ? "captured" : "approved"}${customerEmail ? ` from ${customerEmail}` : ""}`,
          reference_type: "guest_payments",
        });

        // Send confirmation email if configured
        try {
          await supabase.functions.invoke("send-checkoutcom-order-confirmation", {
            body: {
              paymentId,
              customerEmail,
              metadata,
            },
          });
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
        }

        break;
      }

      case "payment_declined":
      case "payment_expired":
      case "payment_canceled": {
        const paymentId = event.data?.id;
        const metadata = event.data?.metadata || {};
        
        console.log(`Payment ${event.type}:`, paymentId);

        // Update payment status to failed
        if (metadata.guest_payment_id) {
          const { error: updateError } = await supabase
            .from("guest_payments")
            .update({ status: "failed" })
            .eq("id", metadata.guest_payment_id);

          if (updateError) {
            console.error("Error updating guest payment:", updateError);
          }
        }

        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment_failed",
          title: "Checkout.com Payment Failed",
          message: `Payment ${paymentId} was ${event.type.replace("payment_", "")}`,
          reference_type: "guest_payments",
        });

        break;
      }

      case "payment_refunded":
      case "payment_void": {
        const paymentId = event.data?.id;
        const metadata = event.data?.metadata || {};
        
        console.log(`Payment ${event.type}:`, paymentId);

        // Update payment status to refunded
        if (metadata.guest_payment_id) {
          const { error: updateError } = await supabase
            .from("guest_payments")
            .update({ status: "refunded" })
            .eq("id", metadata.guest_payment_id);

          if (updateError) {
            console.error("Error updating guest payment:", updateError);
          }
        }

        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment_refunded",
          title: "Checkout.com Payment Refunded",
          message: `Payment ${paymentId} was ${event.type === "payment_void" ? "voided" : "refunded"}`,
          reference_type: "guest_payments",
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
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
