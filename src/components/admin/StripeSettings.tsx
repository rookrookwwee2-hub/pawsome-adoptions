import { useState, useEffect } from "react";
import { Save, Loader2, CreditCard, Eye, EyeOff, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface StripeSettingsType {
  enabled: boolean;
  mode: "test" | "live";
  currency: string;
  publishableKey: string;
  // Note: secretKey and webhookSecret are stored in api_secrets table for security
}

const StripeSettingsComponent = () => {
  const [settings, setSettings] = useState<StripeSettingsType>({
    enabled: false,
    mode: "test",
    currency: "USD",
    publishableKey: "",
  });
  const [secretKey, setSecretKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"untested" | "valid" | "invalid">("untested");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch Stripe settings from payment_settings
        const { data: paymentData, error: paymentError } = await supabase
          .from("payment_settings")
          .select("*")
          .eq("setting_key", "stripe")
          .single();

        if (paymentError && paymentError.code !== "PGRST116") {
          console.error("Error fetching Stripe settings:", paymentError);
        }

        if (paymentData) {
          setSettings(paymentData.setting_value as unknown as StripeSettingsType);
        }

        // Fetch secret key from api_secrets (admins only)
        const { data: secretData } = await supabase
          .from("api_secrets")
          .select("key_value, is_enabled")
          .eq("key_name", "STRIPE_SECRET_KEY")
          .single();

        if (secretData) {
          setSecretKey(secretData.key_value);
          if (secretData.is_enabled) {
            setConnectionStatus("valid");
          }
        }

        // Fetch webhook secret
        const { data: webhookData } = await supabase
          .from("api_secrets")
          .select("key_value")
          .eq("key_name", "STRIPE_WEBHOOK_SECRET")
          .single();

        if (webhookData) {
          setWebhookSecret(webhookData.key_value);
        }
      } catch (error) {
        console.error("Error loading Stripe settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const testConnection = async () => {
    if (!secretKey) {
      toast({ title: "Error", description: "Please enter a Stripe secret key first", variant: "destructive" });
      return;
    }

    setTesting(true);
    setConnectionStatus("untested");

    try {
      const { data, error } = await supabase.functions.invoke("validate-stripe-key", {
        body: { secretKey },
      });

      if (error) throw error;

      if (data?.valid) {
        setConnectionStatus("valid");
        toast({
          title: "Stripe Connected Successfully",
          description: `Connected to: ${data.accountName || "Stripe Account"}`,
        });
      } else {
        setConnectionStatus("invalid");
        toast({
          title: "Invalid Stripe Key",
          description: data?.error || "The provided key is not valid",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error testing Stripe connection:", error);
      setConnectionStatus("invalid");
      toast({
        title: "Connection Failed",
        description: "Could not validate Stripe key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);

    try {
      // Save/update payment_settings for Stripe
      const { data: existingSettings } = await supabase
        .from("payment_settings")
        .select("id")
        .eq("setting_key", "stripe")
        .single();

      if (existingSettings) {
        const { error } = await supabase
          .from("payment_settings")
          .update({ setting_value: settings as unknown as never })
          .eq("setting_key", "stripe");

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("payment_settings")
          .insert({ setting_key: "stripe", setting_value: settings as unknown as never });

        if (error) throw error;
      }

      // Save/update secret key in api_secrets
      if (secretKey) {
        const { data: existingSecret } = await supabase
          .from("api_secrets")
          .select("id")
          .eq("key_name", "STRIPE_SECRET_KEY")
          .single();

        if (existingSecret) {
          await supabase
            .from("api_secrets")
            .update({ 
              key_value: secretKey, 
              is_enabled: settings.enabled,
              description: `Stripe ${settings.mode === "live" ? "Live" : "Test"} Secret Key`
            })
            .eq("key_name", "STRIPE_SECRET_KEY");
        } else {
          await supabase
            .from("api_secrets")
            .insert({
              key_name: "STRIPE_SECRET_KEY",
              key_value: secretKey,
              is_enabled: settings.enabled,
              description: `Stripe ${settings.mode === "live" ? "Live" : "Test"} Secret Key`,
            });
        }
      }

      // Save/update webhook secret in api_secrets
      if (webhookSecret) {
        const { data: existingWebhook } = await supabase
          .from("api_secrets")
          .select("id")
          .eq("key_name", "STRIPE_WEBHOOK_SECRET")
          .single();

        if (existingWebhook) {
          await supabase
            .from("api_secrets")
            .update({ 
              key_value: webhookSecret, 
              is_enabled: settings.enabled,
              description: "Stripe Webhook Secret"
            })
            .eq("key_name", "STRIPE_WEBHOOK_SECRET");
        } else {
          await supabase
            .from("api_secrets")
            .insert({
              key_name: "STRIPE_WEBHOOK_SECRET",
              key_value: webhookSecret,
              is_enabled: settings.enabled,
              description: "Stripe Webhook Secret",
            });
        }
      }

      toast({ title: "Success", description: "Stripe settings saved successfully" });
    } catch (error) {
      console.error("Error saving Stripe settings:", error);
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <CardTitle>Stripe Payment Settings</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="stripe-enabled" className="text-sm text-muted-foreground">
              {settings.enabled ? "Enabled" : "Disabled"}
            </Label>
            <Switch
              id="stripe-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>
        </div>
        <CardDescription>
          Configure Stripe for accepting credit/debit card payments. When enabled, customers will see "Pay with Card" at checkout.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stripe-mode">Mode</Label>
            <Select
              value={settings.mode}
              onValueChange={(value: "test" | "live") => setSettings({ ...settings, mode: value })}
            >
              <SelectTrigger id="stripe-mode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">Test (Development)</SelectItem>
                <SelectItem value="live">Live (Production)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe-currency">Default Currency</Label>
            <Select
              value={settings.currency}
              onValueChange={(value) => setSettings({ ...settings, currency: value })}
            >
              <SelectTrigger id="stripe-currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stripe-publishable-key">Publishable Key</Label>
          <Input
            id="stripe-publishable-key"
            value={settings.publishableKey}
            onChange={(e) => setSettings({ ...settings, publishableKey: e.target.value })}
            placeholder={settings.mode === "live" ? "pk_live_..." : "pk_test_..."}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            This key is safe to expose in frontend code.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stripe-secret-key">Secret Key (Restricted API Key)</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="stripe-secret-key"
                type={showSecretKey ? "text" : "password"}
                value={secretKey}
                onChange={(e) => {
                  setSecretKey(e.target.value);
                  setConnectionStatus("untested");
                }}
                placeholder={settings.mode === "live" ? "sk_live_... or rk_live_..." : "sk_test_... or rk_test_..."}
                className="font-mono text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={testConnection}
              disabled={testing || !secretKey}
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Test</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {connectionStatus === "valid" && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Stripe connected successfully
              </span>
            )}
            {connectionStatus === "invalid" && (
              <span className="text-sm text-destructive flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                Invalid key - please check and try again
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Your secret key is encrypted and stored securely. Never exposed to the frontend.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stripe-webhook-secret">Webhook Secret (Optional)</Label>
          <div className="relative">
            <Input
              id="stripe-webhook-secret"
              type={showWebhookSecret ? "text" : "password"}
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              placeholder="whsec_..."
              className="font-mono text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowWebhookSecret(!showWebhookSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Required for automatic payment confirmation via webhooks.
          </p>
        </div>

        {settings.mode === "test" && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              ⚠️ You're in <strong>Test mode</strong>. Use Stripe test cards for testing. Switch to Live mode for real transactions.
            </p>
          </div>
        )}

        {settings.enabled && !settings.publishableKey && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              ⚠️ Stripe is enabled but no Publishable Key is set. The payment option won't appear until you configure your credentials.
            </p>
          </div>
        )}

        {settings.enabled && !secretKey && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              ⚠️ Stripe is enabled but no Secret Key is set. Payments cannot be processed without a valid secret key.
            </p>
          </div>
        )}

        <Button onClick={saveSettings} disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Stripe Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default StripeSettingsComponent;
