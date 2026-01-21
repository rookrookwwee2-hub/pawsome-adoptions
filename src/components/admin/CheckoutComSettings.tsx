import { useState, useEffect } from "react";
import { Save, Loader2, CreditCard, Eye, EyeOff, CheckCircle2, XCircle, RefreshCw, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

const WebhookUrlSection = () => {
  const [copied, setCopied] = useState(false);
  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkoutcom-webhook`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    sonnerToast.success("Webhook URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2 p-4 border rounded-xl bg-muted/30">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Webhook URL</Label>
        <a
          href="https://dashboard.checkout.com/webhooks"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          Checkout.com Dashboard
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={webhookUrl}
          readOnly
          className="font-mono text-xs bg-background"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Add this URL in your Checkout.com Dashboard under Webhooks. Subscribe to: <code className="bg-muted px-1 rounded">payment_approved</code>, <code className="bg-muted px-1 rounded">payment_captured</code>, <code className="bg-muted px-1 rounded">payment_declined</code>, <code className="bg-muted px-1 rounded">payment_refunded</code>
      </p>
    </div>
  );
};

export interface CheckoutComSettingsType {
  enabled: boolean;
  mode: "sandbox" | "live";
  currency: string;
  publicKey: string;
  secretKey: string;
  applePayEnabled: boolean;
  googlePayEnabled: boolean;
}

const CheckoutComSettings = () => {
  const [settings, setSettings] = useState<CheckoutComSettingsType>({
    enabled: false,
    mode: "sandbox",
    currency: "USD",
    publicKey: "",
    secretKey: "",
    applePayEnabled: true,
    googlePayEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("payment_settings")
      .select("setting_value")
      .eq("setting_key", "checkoutcom")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching Checkout.com settings:", error);
    }

    if (data) {
      setSettings(data.setting_value as unknown as CheckoutComSettingsType);
    }
    setLoading(false);
  };

  const testConnection = async () => {
    if (!settings.secretKey) {
      toast({
        title: "Missing Credentials",
        description: "Please enter the Secret Key before testing",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("validate-checkoutcom-key", {
        body: {
          secretKey: settings.secretKey,
          mode: settings.mode,
        },
      });

      if (error) throw error;

      if (data.valid) {
        setTestResult({ valid: true, message: data.message || "Checkout.com connected successfully" });
        toast({
          title: "Connection Successful",
          description: data.merchantName ? `Connected to: ${data.merchantName}` : "Credentials validated",
        });
      } else {
        setTestResult({ valid: false, message: data.error || "Invalid credentials" });
        toast({
          title: "Connection Failed",
          description: data.error || "Invalid Checkout.com credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Test connection error:", error);
      setTestResult({ valid: false, message: "Failed to validate credentials" });
      toast({
        title: "Error",
        description: "Failed to validate Checkout.com credentials",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);

    // Check if settings exist
    const { data: existing } = await supabase
      .from("payment_settings")
      .select("id")
      .eq("setting_key", "checkoutcom")
      .single();

    let error;
    if (existing) {
      const result = await supabase
        .from("payment_settings")
        .update({ setting_value: settings as unknown as never })
        .eq("setting_key", "checkoutcom");
      error = result.error;
    } else {
      const result = await supabase
        .from("payment_settings")
        .insert({ 
          setting_key: "checkoutcom",
          setting_value: settings as unknown as never 
        });
      error = result.error;
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Checkout.com settings saved successfully" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Checkout.com Settings
            </CardTitle>
            <CardDescription>
              Accept credit/debit card payments (Visa, MasterCard, Amex)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="checkoutcom-enabled" className="text-sm">
              {settings.enabled ? "Enabled" : "Disabled"}
            </Label>
            <Switch
              id="checkoutcom-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Mode</Label>
            <Select
              value={settings.mode}
              onValueChange={(value: "sandbox" | "live") =>
                setSettings({ ...settings, mode: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                <SelectItem value="live">Live (Production)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={settings.currency}
              onValueChange={(value) => setSettings({ ...settings, currency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* API Keys */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="public-key">Public Key</Label>
            <Input
              id="public-key"
              value={settings.publicKey}
              onChange={(e) => setSettings({ ...settings, publicKey: e.target.value })}
              placeholder="pk_sbox_... or pk_live_..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Used for client-side card tokenization. Find it in your Checkout.com Dashboard.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret-key">Secret Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="secret-key"
                  type={showSecretKey ? "text" : "password"}
                  value={settings.secretKey}
                  onChange={(e) => setSettings({ ...settings, secretKey: e.target.value })}
                  placeholder="sk_sbox_... or sk_live_..."
                  className="font-mono text-sm pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={testConnection}
                disabled={testing || !settings.secretKey}
              >
                {testing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : testResult?.valid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : testResult?.valid === false ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2">Test</span>
              </Button>
            </div>
            {testResult && (
              <p className={`text-xs ${testResult.valid ? "text-green-600" : "text-red-600"}`}>
                {testResult.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Server-side key for processing payments. Never expose this to the frontend.
            </p>
          </div>
        </div>

        {/* Webhook URL Section */}
        <WebhookUrlSection />

        {/* Warnings */}
        {settings.mode === "sandbox" && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              ⚠️ You are in <strong>Sandbox</strong> mode. Payments will not be processed for real.
            </p>
          </div>
        )}

        {settings.enabled && (!settings.publicKey || !settings.secretKey) && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              ⚠️ Checkout.com is enabled but API keys are missing. Card payments won't work until configured.
            </p>
          </div>
        )}

        {/* Digital Wallets Section */}
        <div className="p-4 border rounded-xl bg-muted/30 space-y-4">
          <div>
            <Label className="text-sm font-medium">Digital Wallets</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Enable Apple Pay and Google Pay for faster mobile checkout. These will only appear on supported devices.
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Apple Pay</p>
                  <p className="text-xs text-muted-foreground">Safari on iOS & macOS</p>
                </div>
              </div>
              <Switch
                checked={settings.applePayEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, applePayEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Google Pay</p>
                  <p className="text-xs text-muted-foreground">Chrome on Android & Web</p>
                </div>
              </div>
              <Switch
                checked={settings.googlePayEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, googlePayEnabled: checked })}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Note: Digital wallets require additional configuration in your Checkout.com Dashboard for production use.
          </p>
        </div>

        {/* Card Brands Info */}
        <div className="p-4 border rounded-xl bg-muted/30">
          <Label className="text-sm font-medium">Supported Cards</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Visa, MasterCard, American Express, Discover, Diners Club, JCB
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            3D Secure authentication is automatically enabled for enhanced security.
          </p>
        </div>

        {/* Save Button */}
        <Button onClick={saveSettings} disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Checkout.com Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default CheckoutComSettings;
