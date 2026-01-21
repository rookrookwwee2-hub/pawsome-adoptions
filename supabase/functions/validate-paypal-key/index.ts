import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getApiSecret } from "../_shared/getApiSecret.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientId, secretKey, mode } = await req.json();

    if (!clientId || !secretKey) {
      return new Response(
        JSON.stringify({ valid: false, error: "Client ID and Secret Key are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine PayPal API base URL
    const baseUrl = mode === "live" 
      ? "https://api-m.paypal.com" 
      : "https://api-m.sandbox.paypal.com";

    // Get OAuth2 access token
    const authString = btoa(`${clientId}:${secretKey}`);
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
        JSON.stringify({ 
          valid: false, 
          error: errorData.error_description || "Invalid PayPal credentials" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch account info to validate the token works
    const accountResponse = await fetch(`${baseUrl}/v1/identity/oauth2/userinfo?schema=openid`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!accountResponse.ok) {
      // Token is valid but account info might not be accessible, that's okay
      return new Response(
        JSON.stringify({ 
          valid: true, 
          message: "PayPal credentials validated successfully",
          mode: mode || "sandbox"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const accountData = await accountResponse.json();

    return new Response(
      JSON.stringify({ 
        valid: true, 
        message: "PayPal connected successfully",
        mode: mode || "sandbox",
        email: accountData.email || null
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("PayPal validation error:", error);
    return new Response(
      JSON.stringify({ valid: false, error: "Failed to validate PayPal credentials" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
