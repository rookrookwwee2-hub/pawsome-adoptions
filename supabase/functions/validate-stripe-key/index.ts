import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
    const { secretKey } = await req.json();

    if (!secretKey) {
      return new Response(
        JSON.stringify({ valid: false, error: "No secret key provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate the key format
    const isValidFormat = /^(sk|rk)_(test|live)_[a-zA-Z0-9]+$/.test(secretKey);
    if (!isValidFormat) {
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid key format. Expected sk_test_*, sk_live_*, rk_test_*, or rk_live_*" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Test the key by fetching account info from Stripe
    const response = await fetch("https://api.stripe.com/v1/account", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Stripe API error:", errorData);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: errorData.error?.message || "Invalid API key" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const accountData = await response.json();
    
    return new Response(
      JSON.stringify({ 
        valid: true, 
        accountName: accountData.business_profile?.name || accountData.email || "Stripe Account",
        accountId: accountData.id,
        livemode: accountData.livemode,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error validating Stripe key:", error);
    return new Response(
      JSON.stringify({ valid: false, error: "Failed to validate key" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
