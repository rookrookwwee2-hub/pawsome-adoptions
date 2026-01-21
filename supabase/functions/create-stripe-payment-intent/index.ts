import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getApiSecret } from "../_shared/getApiSecret.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency, metadata } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the Stripe secret key from api_secrets
    const stripeSecretKey = await getApiSecret("STRIPE_SECRET_KEY");
    
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe is not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create PaymentIntent with Stripe API
    const params = new URLSearchParams();
    params.append("amount", Math.round(amount * 100).toString()); // Stripe uses cents
    params.append("currency", (currency || "usd").toLowerCase());
    params.append("automatic_payment_methods[enabled]", "true");
    
    // Add metadata if provided
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        params.append(`metadata[${key}]`, String(value));
      });
    }

    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Stripe API error:", errorData);
      return new Response(
        JSON.stringify({ error: errorData.error?.message || "Failed to create payment" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paymentIntent = await response.json();

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error creating payment intent:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create payment intent" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
