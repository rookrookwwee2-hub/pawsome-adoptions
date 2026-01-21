import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { amount, currency, metadata, successUrl, failureUrl } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get settings from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Checkout.com settings from payment_settings
    const { data: settingsData, error: settingsError } = await supabase
      .from("payment_settings")
      .select("setting_value")
      .eq("setting_key", "checkoutcom")
      .single();

    if (settingsError || !settingsData) {
      console.error("Error fetching Checkout.com settings:", settingsError);
      return new Response(
        JSON.stringify({ error: "Checkout.com is not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const settings = settingsData.setting_value as {
      enabled: boolean;
      mode: "sandbox" | "live";
      publicKey: string;
      secretKey: string;
      currency: string;
    };

    if (!settings.enabled) {
      return new Response(
        JSON.stringify({ error: "Checkout.com payments are disabled" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!settings.secretKey) {
      return new Response(
        JSON.stringify({ error: "Checkout.com secret key not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine base URL based on mode
    const baseUrl = settings.mode === "live"
      ? "https://api.checkout.com"
      : "https://api.sandbox.checkout.com";

    // Create a Payment Session
    // Amount should be in minor units (cents)
    const amountInCents = Math.round(amount * 100);
    const paymentCurrency = (currency || settings.currency || "USD").toUpperCase();

    const paymentRequest = {
      amount: amountInCents,
      currency: paymentCurrency,
      billing: {
        address: {
          country: "US", // Default, can be overridden by metadata
        },
      },
      success_url: successUrl || `${req.headers.get("origin")}/checkout?payment_status=success`,
      failure_url: failureUrl || `${req.headers.get("origin")}/checkout?payment_status=failed`,
      metadata: metadata || {},
      "3ds": {
        enabled: true,
      },
      processing_channel_id: undefined as string | undefined,
    };

    // Create payment session for Hosted Payments Page
    const sessionResponse = await fetch(`${baseUrl}/payment-sessions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${settings.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
    });

    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json();
      console.error("Checkout.com session error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: errorData.message || "Failed to create payment session" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sessionData = await sessionResponse.json();

    return new Response(
      JSON.stringify({
        sessionId: sessionData.id,
        sessionToken: sessionData.session_token,
        paymentLink: sessionData._links?.redirect?.href,
        publicKey: settings.publicKey,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating Checkout.com session:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create payment session" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
