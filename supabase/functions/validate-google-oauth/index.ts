import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientId, clientSecret } = await req.json();

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ valid: false, error: "Missing client ID or secret" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Validate by attempting to get token info endpoint
    // This is a lightweight check that verifies the credentials format
    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    
    // We'll verify credentials by making a test request to Google's token endpoint
    // Using an invalid grant type to check if credentials are recognized
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: "test_validation_code",
        redirect_uri: "https://localhost",
      }),
    });

    const data = await response.json();

    // If we get "invalid_grant" error, credentials are valid but code is invalid (expected)
    // If we get "invalid_client" error, credentials are invalid
    if (data.error === "invalid_grant" || data.error === "redirect_uri_mismatch") {
      return new Response(
        JSON.stringify({ 
          valid: true, 
          message: "Google OAuth credentials are valid" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (data.error === "invalid_client") {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Invalid client ID or client secret" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Any other response suggests the credentials might work
      return new Response(
        JSON.stringify({ 
          valid: true, 
          message: "Credentials appear to be configured correctly" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Validation error:", error);
    return new Response(
      JSON.stringify({ valid: false, error: "Failed to validate credentials" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
