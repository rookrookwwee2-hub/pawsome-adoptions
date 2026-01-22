import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, EyeOff, TestTube, Save, ExternalLink } from "lucide-react";
import { toast as sonnerToast } from "sonner";

interface GoogleOAuthSettingsType {
  id: string;
  client_id: string;
  redirect_uri: string;
  scopes: string;
  enabled: boolean;
  show_on_login: boolean;
  default_user_role: "admin" | "user";
}

const GoogleOAuthSettings = () => {
  const [settings, setSettings] = useState<GoogleOAuthSettingsType | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Fetch OAuth settings
      const { data: oauthData, error: oauthError } = await supabase
        .from("google_oauth_settings")
        .select("*")
        .limit(1)
        .single();

      if (oauthError) throw oauthError;
      setSettings(oauthData as GoogleOAuthSettingsType);

      // Fetch client secret from api_secrets
      const { data: secretData } = await supabase
        .from("api_secrets")
        .select("key_value")
        .eq("key_name", "GOOGLE_CLIENT_SECRET")
        .eq("is_enabled", true)
        .maybeSingle();

      if (secretData) {
        setClientSecret(secretData.key_value);
      }
    } catch (error) {
      console.error("Error fetching Google OAuth settings:", error);
      toast({
        title: "Error",
        description: "Failed to load Google OAuth settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);

    try {
      // Update OAuth settings
      const { error: oauthError } = await supabase
        .from("google_oauth_settings")
        .update({
          client_id: settings.client_id,
          redirect_uri: settings.redirect_uri,
          scopes: settings.scopes,
          enabled: settings.enabled,
          show_on_login: settings.show_on_login,
          default_user_role: settings.default_user_role,
        })
        .eq("id", settings.id);

      if (oauthError) throw oauthError;

      // Save/update client secret in api_secrets
      if (clientSecret) {
        const { data: existingSecret } = await supabase
          .from("api_secrets")
          .select("id")
          .eq("key_name", "GOOGLE_CLIENT_SECRET")
          .maybeSingle();

        if (existingSecret) {
          await supabase
            .from("api_secrets")
            .update({ key_value: clientSecret, is_enabled: true })
            .eq("id", existingSecret.id);
        } else {
          await supabase.from("api_secrets").insert({
            key_name: "GOOGLE_CLIENT_SECRET",
            key_value: clientSecret,
            description: "Google OAuth Client Secret",
            is_enabled: true,
          });
        }
      }

      toast({
        title: "Success",
        description: "Google OAuth settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    if (!settings?.client_id || !clientSecret) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both Client ID and Client Secret",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("validate-google-oauth", {
        body: { clientId: settings.client_id, clientSecret },
      });

      if (error) throw error;

      if (data?.valid) {
        sonnerToast.success("Connection successful! Google OAuth is properly configured.");
      } else {
        sonnerToast.error(data?.error || "Connection test failed");
      }
    } catch (error) {
      console.error("Test connection error:", error);
      sonnerToast.error("Failed to test connection. Please check your credentials.");
    } finally {
      setTesting(false);
    }
  };

  const copyRedirectUri = () => {
    const uri = settings?.redirect_uri || `${window.location.origin}/auth/callback`;
    navigator.clipboard.writeText(uri);
    sonnerToast.success("Redirect URI copied to clipboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google OAuth Settings
          </CardTitle>
          <CardDescription>
            Configure Google Sign-In for your application. Get credentials from{" "}
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Google Cloud Console <ExternalLink className="h-3 w-3" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enabled">Enable Google OAuth</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to sign in with their Google account
              </p>
            </div>
            <Switch
              id="enabled"
              checked={settings?.enabled || false}
              onCheckedChange={(checked) =>
                setSettings((prev) => prev ? { ...prev, enabled: checked } : null)
              }
            />
          </div>

          {/* Show on Login Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="show_on_login">Show on Login Page</Label>
              <p className="text-sm text-muted-foreground">
                Display Google sign-in button on login/register pages
              </p>
            </div>
            <Switch
              id="show_on_login"
              checked={settings?.show_on_login || false}
              onCheckedChange={(checked) =>
                setSettings((prev) => prev ? { ...prev, show_on_login: checked } : null)
              }
            />
          </div>

          {/* Client ID */}
          <div className="space-y-2">
            <Label htmlFor="client_id">Client ID</Label>
            <Input
              id="client_id"
              placeholder="your-client-id.apps.googleusercontent.com"
              value={settings?.client_id || ""}
              onChange={(e) =>
                setSettings((prev) => prev ? { ...prev, client_id: e.target.value } : null)
              }
            />
          </div>

          {/* Client Secret */}
          <div className="space-y-2">
            <Label htmlFor="client_secret">Client Secret</Label>
            <div className="relative">
              <Input
                id="client_secret"
                type={showSecret ? "text" : "password"}
                placeholder="GOCSPX-..."
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Stored securely in encrypted API secrets
            </p>
          </div>

          {/* Redirect URI */}
          <div className="space-y-2">
            <Label htmlFor="redirect_uri">Redirect URI</Label>
            <div className="flex gap-2">
              <Input
                id="redirect_uri"
                placeholder={`${window.location.origin}/auth/callback`}
                value={settings?.redirect_uri || ""}
                onChange={(e) =>
                  setSettings((prev) => prev ? { ...prev, redirect_uri: e.target.value } : null)
                }
              />
              <Button variant="outline" onClick={copyRedirectUri}>
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add this URI to your Google Cloud Console authorized redirect URIs
            </p>
          </div>

          {/* Scopes */}
          <div className="space-y-2">
            <Label htmlFor="scopes">OAuth Scopes</Label>
            <Input
              id="scopes"
              placeholder="openid email profile"
              value={settings?.scopes || ""}
              onChange={(e) =>
                setSettings((prev) => prev ? { ...prev, scopes: e.target.value } : null)
              }
            />
            <p className="text-xs text-muted-foreground">
              Space-separated list of OAuth scopes
            </p>
          </div>

          {/* Default Role */}
          <div className="space-y-2">
            <Label htmlFor="default_role">Default User Role</Label>
            <Select
              value={settings?.default_user_role || "user"}
              onValueChange={(value: "admin" | "user") =>
                setSettings((prev) => prev ? { ...prev, default_user_role: value } : null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Role assigned to new users who sign in with Google
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Settings
            </Button>
            <Button variant="outline" onClick={testConnection} disabled={testing}>
              {testing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="mr-2 h-4 w-4" />
              )}
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuthSettings;
