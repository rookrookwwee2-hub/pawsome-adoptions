import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getApiSecret } from "../_shared/getApiSecret.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type PayPalOrderItem = {
  name: string;
  quantity?: number;
  unitPrice?: number;
};

type PayPalOrderConfirmationRequest = {
  orderId: string;
  payerId?: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
  };
  items?: PayPalOrderItem[];
};

function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.includes("@") &&
    value.length <= 320
  );
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(amount: number, currency: string) {
  // Keep predictable formatting server-side.
  return `${amount.toFixed(2)} ${currency}`;
}

async function getAdminEmails() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) return [] as string[];

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch admin user ids first, then their profile emails.
  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");

  if (rolesError || !roles?.length) {
    if (rolesError) console.error("Failed to fetch admin roles:", rolesError);
    return [];
  }

  const adminIds = roles.map((r) => r.user_id).filter(Boolean);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("email")
    .in("id", adminIds);

  if (profilesError) {
    console.error("Failed to fetch admin emails:", profilesError);
    return [];
  }

  return (profiles || [])
    .map((p) => p.email)
    .filter((e): e is string => typeof e === "string" && e.includes("@"));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = await getApiSecret("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          error:
            "Email notifications are disabled (RESEND_API_KEY missing or disabled).",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const payload = (await req.json()) as Partial<PayPalOrderConfirmationRequest>;

    const orderId = typeof payload.orderId === "string" ? payload.orderId.trim() : "";
    const payerId = typeof payload.payerId === "string" ? payload.payerId.trim() : "";
    const currency = typeof payload.currency === "string" ? payload.currency.trim() : "USD";
    const amount = typeof payload.amount === "number" ? payload.amount : NaN;

    const customerName = payload.customer?.name;
    const customerEmail = payload.customer?.email;

    if (!orderId || !Number.isFinite(amount) || amount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid order payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (typeof customerName !== "string" || customerName.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Invalid customer name" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!isEmail(customerEmail)) {
      return new Response(JSON.stringify({ error: "Invalid customer email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const safeCustomerName = escapeHtml(customerName.trim());
    const safeOrderId = escapeHtml(orderId);
    const safePayerId = escapeHtml(payerId || "—");
    const totalText = escapeHtml(formatMoney(amount, currency));

    const items = Array.isArray(payload.items) ? payload.items : [];
    const itemsHtml = items.length
      ? `
        <h3 style="margin: 18px 0 8px;">Items</h3>
        <ul>
          ${items
            .slice(0, 50)
            .map((i) => {
              const name = escapeHtml(String(i?.name ?? "Item"));
              const qty = typeof i?.quantity === "number" ? i.quantity : 1;
              const unit = typeof i?.unitPrice === "number" ? i.unitPrice : undefined;
              const suffix = unit != null
                ? ` — ${escapeHtml(formatMoney(unit, currency))} x ${qty}`
                : ` — x ${qty}`;
              return `<li>${name}${suffix}</li>`;
            })
            .join("\n")}
        </ul>
      `
      : "";

    const resend = new Resend(resendApiKey);
    const from = "PawfectMatch <onboarding@resend.dev>";

    const adminEmails = await getAdminEmails();

    const customerEmailResponse = await resend.emails.send({
      from,
      to: [customerEmail],
      subject: `Your PayPal order is confirmed (Order ${orderId})`,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
          <h1 style="margin: 0 0 10px;">Thank you, ${safeCustomerName}!</h1>
          <p style="margin: 0 0 14px;">We received your PayPal payment and your order is confirmed.</p>

          <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
            <tr>
              <td style="padding: 6px 0; color: #555;">Order ID</td>
              <td style="padding: 6px 0; font-weight: 600;">${safeOrderId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #555;">Total</td>
              <td style="padding: 6px 0; font-weight: 600;">${totalText}</td>
            </tr>
          </table>

          ${itemsHtml}

          <p style="margin: 18px 0 0; color: #666; font-size: 14px;">
            If you have any questions, just reply to this email.
          </p>
        </div>
      `,
    });

    let adminEmailResponse: unknown = null;
    if (adminEmails.length > 0) {
      adminEmailResponse = await resend.emails.send({
        from,
        to: adminEmails,
        subject: `New PayPal order completed (${orderId})`,
        html: `
          <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
            <h1 style="margin: 0 0 10px;">PayPal payment completed</h1>
            <p style="margin: 0 0 14px;">A customer completed a PayPal payment.</p>
            <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
              <tr>
                <td style="padding: 6px 0; color: #555;">Order ID</td>
                <td style="padding: 6px 0; font-weight: 600;">${safeOrderId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #555;">Payer ID</td>
                <td style="padding: 6px 0; font-weight: 600;">${safePayerId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #555;">Customer</td>
                <td style="padding: 6px 0; font-weight: 600;">${safeCustomerName} (${escapeHtml(
          customerEmail,
        )})</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #555;">Total</td>
                <td style="padding: 6px 0; font-weight: 600;">${totalText}</td>
              </tr>
            </table>
            ${itemsHtml}
          </div>
        `,
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        customer: customerEmailResponse,
        admin: adminEmailResponse,
        adminRecipients: adminEmails.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("send-paypal-order-confirmation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send confirmation emails" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
