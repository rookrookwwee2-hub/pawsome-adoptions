import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Fetches an API secret from the database if it's enabled.
 * Returns null if the secret doesn't exist or is disabled.
 * 
 * Usage in edge functions:
 * ```typescript
 * import { getApiSecret, isSecretEnabled } from "../_shared/getApiSecret.ts";
 * 
 * const resendApiKey = await getApiSecret("RESEND_API_KEY");
 * if (!resendApiKey) {
 *   return new Response(JSON.stringify({ error: "Email service not configured" }), { status: 503 });
 * }
 * ```
 */
export async function getApiSecret(keyName: string): Promise<string | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables");
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("api_secrets")
    .select("key_value, is_enabled")
    .eq("key_name", keyName)
    .single();

  if (error) {
    console.error(`Error fetching API secret "${keyName}":`, error.message);
    return null;
  }

  if (!data || !data.is_enabled) {
    console.log(`API secret "${keyName}" is not enabled or doesn't exist`);
    return null;
  }

  return data.key_value;
}

/**
 * Checks if an API secret is enabled without returning the value.
 */
export async function isSecretEnabled(keyName: string): Promise<boolean> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("api_secrets")
    .select("is_enabled")
    .eq("key_name", keyName)
    .single();

  if (error || !data) {
    return false;
  }

  return data.is_enabled;
}
