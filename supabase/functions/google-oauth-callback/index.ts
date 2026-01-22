import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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
    const { code, redirectUri } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Authorization code is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OAuth settings
    const { data: oauthSettings, error: settingsError } = await supabase
      .from("google_oauth_settings")
      .select("*")
      .limit(1)
      .single();

    if (settingsError || !oauthSettings) {
      return new Response(
        JSON.stringify({ error: "OAuth settings not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Get client secret using the shared utility
    const clientSecret = await getApiSecret("GOOGLE_CLIENT_SECRET");
    if (!clientSecret) {
      return new Response(
        JSON.stringify({ error: "Client secret not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: oauthSettings.client_id,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri || oauthSettings.redirect_uri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Token exchange error:", tokenData);
      return new Response(
        JSON.stringify({ error: tokenData.error_description || "Failed to exchange code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfo.email) {
      return new Response(
        JSON.stringify({ error: "Failed to get user email from Google" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === userInfo.email);

    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: userInfo.email,
        email_confirm: true,
        user_metadata: {
          full_name: userInfo.name,
          avatar_url: userInfo.picture,
          google_id: userInfo.id,
        },
      });

      if (createError) {
        console.error("User creation error:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create user account" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      userId = newUser.user.id;
      isNewUser = true;

      // Assign default role
      await supabase.from("user_roles").insert({
        user_id: userId,
        role: oauthSettings.default_user_role || "user",
      });
    }

    // Generate a magic link for sign in
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: userInfo.email,
    });

    if (linkError) {
      console.error("Magic link error:", linkError);
      return new Response(
        JSON.stringify({ error: "Failed to generate sign-in link" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        isNewUser,
        user: {
          id: userId,
          email: userInfo.email,
          name: userInfo.name,
          avatar: userInfo.picture,
        },
        // Return the token hash for client-side verification
        tokenHash: linkData.properties?.hashed_token,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
