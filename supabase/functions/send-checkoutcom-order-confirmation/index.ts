import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { paymentId, customerEmail, metadata } = await req.json();

    if (!customerEmail) {
      console.log("No customer email provided, skipping confirmation");
      return new Response(
        JSON.stringify({ success: false, message: "No customer email" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Resend API key
    const resendApiKey = await getApiSecret("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("Resend API key not configured, skipping email");
      return new Response(
        JSON.stringify({ success: false, message: "Email service not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send confirmation email
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Petopia <noreply@resend.dev>",
        to: [customerEmail],
        subject: "Payment Confirmed - Thank You for Your Order!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Payment Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Payment Confirmed! 🎉</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Dear Customer,</p>
              <p>Thank you for your payment! Your transaction has been successfully processed.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Payment ID:</strong> ${paymentId}</p>
                ${metadata?.customer_name ? `<p style="margin: 10px 0 0;"><strong>Name:</strong> ${metadata.customer_name}</p>` : ""}
              </div>
              <p>We'll be in touch shortly with next steps regarding your adoption process.</p>
              <p style="margin-top: 30px;">Best regards,<br>The Petopia Team</p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      console.error("Email send error:", emailError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send email" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Confirmation email sent to:", customerEmail);
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending confirmation:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
