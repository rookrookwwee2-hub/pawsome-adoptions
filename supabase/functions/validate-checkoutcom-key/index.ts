import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { secretKey, mode } = await req.json();

    if (!secretKey) {
      return new Response(
        JSON.stringify({ valid: false, error: "Secret key is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate key format - Checkout.com uses sk_xxx format
    const keyPattern = /^sk_(test|sbox|live)_[a-zA-Z0-9-]+$/;
    if (!keyPattern.test(secretKey)) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Invalid key format. Key should start with sk_test_, sk_sbox_, or sk_live_" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine base URL based on mode
    const baseUrl = mode === "live" 
      ? "https://api.checkout.com"
      : "https://api.sandbox.checkout.com";

    // Test the key by fetching merchant details
    const response = await fetch(`${baseUrl}/merchants/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Checkout.com API error:", errorText);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Invalid credentials or API error" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const merchantData = await response.json();

    return new Response(
      JSON.stringify({
        valid: true,
        message: "Checkout.com connected successfully",
        merchantId: merchantData.id,
        merchantName: merchantData.name || "Checkout.com Merchant",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error validating Checkout.com key:", error);
    return new Response(
      JSON.stringify({ valid: false, error: "Failed to validate credentials" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
