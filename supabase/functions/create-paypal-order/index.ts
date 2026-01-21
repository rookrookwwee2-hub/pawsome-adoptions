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
    const { amount, currency, description, metadata } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
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

    // Create PayPal order
    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: (currency || settings.currency || "USD").toUpperCase(),
            value: amount.toFixed(2),
          },
          description: description || "Pet Adoption Payment",
          custom_id: metadata?.guest_payment_id || undefined,
        },
      ],
      application_context: {
        brand_name: "PawfectMatch",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${Deno.env.get("SUPABASE_URL")?.replace("supabase.co", "lovable.app")}/checkout?success=true`,
        cancel_url: `${Deno.env.get("SUPABASE_URL")?.replace("supabase.co", "lovable.app")}/checkout?cancelled=true`,
      },
    };

    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json().catch(() => ({}));
      console.error("PayPal order creation error:", errorData);
      return new Response(
        JSON.stringify({ error: errorData.message || "Failed to create PayPal order" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const order = await orderResponse.json();

    return new Response(
      JSON.stringify({ 
        orderId: order.id,
        status: order.status,
        links: order.links,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create PayPal order" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
