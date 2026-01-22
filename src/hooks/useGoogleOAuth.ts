import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GoogleOAuthSettings {
  enabled: boolean;
  show_on_login: boolean;
  client_id: string;
  redirect_uri: string;
  scopes: string;
}

export const useGoogleOAuth = () => {
  const [settings, setSettings] = useState<GoogleOAuthSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("google_oauth_settings")
          .select("enabled, show_on_login, client_id, redirect_uri, scopes")
          .limit(1)
          .single();

        if (error) throw error;
        setSettings(data as GoogleOAuthSettings);
      } catch (error) {
        console.error("Error fetching Google OAuth settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const initiateGoogleLogin = () => {
    if (!settings?.enabled || !settings?.client_id) {
      console.error("Google OAuth is not properly configured");
      return;
    }

    const redirectUri = settings.redirect_uri || `${window.location.origin}/auth/callback`;
    const scopes = settings.scopes || "openid email profile";
    
    const params = new URLSearchParams({
      client_id: settings.client_id,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline",
      prompt: "consent",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return {
    settings,
    loading,
    isEnabled: settings?.enabled && settings?.show_on_login && !!settings?.client_id,
    initiateGoogleLogin,
  };
};
