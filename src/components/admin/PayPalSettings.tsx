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
import type { PayPalSettings as PayPalSettingsType } from "@/hooks/usePaymentSettings";

const PayPalSettingsComponent = () => {
  const [settings, setSettings] = useState<PayPalSettingsType>({
    enabled: false,
    clientId: "",
    secretKey: "",
    email: "",
    mode: "sandbox",
    currency: "USD",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("payment_settings")
        .select("*")
        .eq("setting_key", "paypal")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching PayPal settings:", error);
        toast({ title: "Error", description: "Failed to load PayPal settings", variant: "destructive" });
      }

      if (data) {
        setSettings(data.setting_value as unknown as PayPalSettingsType);
      }
      setLoading(false);
    };

    fetchSettings();
  }, [toast]);

  const testConnection = async () => {
    if (!settings.clientId || !settings.secretKey) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both Client ID and Secret Key before testing",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("validate-paypal-key", {
        body: {
          clientId: settings.clientId,
          secretKey: settings.secretKey,
          mode: settings.mode,
        },
      });

      if (error) throw error;

      if (data.valid) {
        setTestResult({ valid: true, message: data.message || "PayPal connected successfully" });
        toast({
          title: "Connection Successful",
          description: data.message || "PayPal credentials validated",
        });
      } else {
        setTestResult({ valid: false, message: data.error || "Invalid credentials" });
        toast({
          title: "Connection Failed",
          description: data.error || "Invalid PayPal credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Test connection error:", error);
      setTestResult({ valid: false, message: "Failed to validate credentials" });
      toast({
        title: "Error",
        description: "Failed to validate PayPal credentials",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("payment_settings")
      .update({ setting_value: settings as unknown as never })
      .eq("setting_key", "paypal");

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "PayPal settings saved successfully" });
    }
    setSaving(false);
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
            <CardTitle>PayPal Payment Settings</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="paypal-enabled" className="text-sm text-muted-foreground">
              {settings.enabled ? "Enabled" : "Disabled"}
            </Label>
            <Switch
              id="paypal-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>
        </div>
        <CardDescription>
          Configure PayPal integration for receiving payments. When enabled, customers will see PayPal as a payment option at checkout.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paypal-mode">Mode</Label>
            <Select
              value={settings.mode}
              onValueChange={(value: "sandbox" | "live") => {
                setSettings({ ...settings, mode: value });
                setTestResult(null);
              }}
            >
              <SelectTrigger id="paypal-mode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                <SelectItem value="live">Live (Production)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paypal-currency">Default Currency</Label>
            <Select
              value={settings.currency}
              onValueChange={(value) => setSettings({ ...settings, currency: value })}
            >
              <SelectTrigger id="paypal-currency">
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
          <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
          <Input
            id="paypal-client-id"
            value={settings.clientId}
            onChange={(e) => {
              setSettings({ ...settings, clientId: e.target.value });
              setTestResult(null);
            }}
            placeholder="Enter PayPal Client ID"
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paypal-secret">PayPal Secret Key</Label>
          <div className="relative">
            <Input
              id="paypal-secret"
              type={showSecret ? "text" : "password"}
              value={settings.secretKey}
              onChange={(e) => {
                setSettings({ ...settings, secretKey: e.target.value });
                setTestResult(null);
              }}
              placeholder="Enter PayPal Secret Key"
              className="font-mono text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your Secret Key is stored securely and never exposed to the frontend.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paypal-email">PayPal Email (Optional)</Label>
          <Input
            id="paypal-email"
            type="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            placeholder="your-business@email.com"
          />
        </div>

        {/* Test Connection Button and Result */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={testConnection}
            disabled={testing || !settings.clientId || !settings.secretKey}
          >
            {testing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Test Connection
          </Button>
          
          {testResult && (
            <div className={`flex items-center gap-2 text-sm ${testResult.valid ? "text-green-600" : "text-destructive"}`}>
              {testResult.valid ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {testResult.message}
            </div>
          )}
        </div>

        {settings.mode === "sandbox" && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              ⚠️ You're in <strong>Sandbox mode</strong>. Payments will use PayPal's test environment. Switch to Live mode for real transactions.
            </p>
          </div>
        )}

        {settings.enabled && !settings.clientId && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              ⚠️ PayPal is enabled but no Client ID is set. The payment option won't appear until you configure your credentials.
            </p>
          </div>
        )}

        <Button onClick={saveSettings} disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save PayPal Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default PayPalSettingsComponent;
