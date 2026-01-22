import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, BarChart3, Tags, ExternalLink, CheckCircle } from "lucide-react";
import { toast as sonnerToast } from "sonner";

interface AnalyticsSettingsType {
  id: string;
  ga_measurement_id: string;
  ga_enabled: boolean;
  gtm_container_id: string;
  gtm_enabled: boolean;
}

const AnalyticsSettings = () => {
  const [settings, setSettings] = useState<AnalyticsSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("analytics_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      setSettings(data as AnalyticsSettingsType);
    } catch (error) {
      console.error("Error fetching analytics settings:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics settings",
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
      const { error } = await supabase
        .from("analytics_settings")
        .update({
          ga_measurement_id: settings.ga_measurement_id,
          ga_enabled: settings.ga_enabled,
          gtm_container_id: settings.gtm_container_id,
          gtm_enabled: settings.gtm_enabled,
        })
        .eq("id", settings.id);

      if (error) throw error;

      sonnerToast.success("Analytics settings saved successfully");
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

  const validateGAId = (id: string) => {
    return /^G-[A-Z0-9]+$/.test(id);
  };

  const validateGTMId = (id: string) => {
    return /^GTM-[A-Z0-9]+$/.test(id);
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
      {/* Google Analytics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            Google Analytics 4
          </CardTitle>
          <CardDescription>
            Track website traffic and user behavior.{" "}
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Get your Measurement ID <ExternalLink className="h-3 w-3" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable GA Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="ga_enabled">Enable Google Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Load GA4 tracking script on all pages
              </p>
            </div>
            <Switch
              id="ga_enabled"
              checked={settings?.ga_enabled || false}
              onCheckedChange={(checked) =>
                setSettings((prev) => prev ? { ...prev, ga_enabled: checked } : null)
              }
            />
          </div>

          {/* GA Measurement ID */}
          <div className="space-y-2">
            <Label htmlFor="ga_measurement_id">Measurement ID</Label>
            <div className="relative">
              <Input
                id="ga_measurement_id"
                placeholder="G-XXXXXXXXXX"
                value={settings?.ga_measurement_id || ""}
                onChange={(e) =>
                  setSettings((prev) => prev ? { ...prev, ga_measurement_id: e.target.value.toUpperCase() } : null)
                }
                className={
                  settings?.ga_measurement_id && !validateGAId(settings.ga_measurement_id)
                    ? "border-destructive"
                    : ""
                }
              />
              {settings?.ga_measurement_id && validateGAId(settings.ga_measurement_id) && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {settings?.ga_measurement_id && !validateGAId(settings.ga_measurement_id) && (
              <p className="text-xs text-destructive">
                Invalid format. Should be like G-XXXXXXXXXX
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Google Tag Manager Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5 text-blue-500" />
            Google Tag Manager
          </CardTitle>
          <CardDescription>
            Manage all your tracking tags in one place.{" "}
            <a
              href="https://tagmanager.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Get your Container ID <ExternalLink className="h-3 w-3" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable GTM Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="gtm_enabled">Enable Tag Manager</Label>
              <p className="text-sm text-muted-foreground">
                Load GTM container on all pages
              </p>
            </div>
            <Switch
              id="gtm_enabled"
              checked={settings?.gtm_enabled || false}
              onCheckedChange={(checked) =>
                setSettings((prev) => prev ? { ...prev, gtm_enabled: checked } : null)
              }
            />
          </div>

          {/* GTM Container ID */}
          <div className="space-y-2">
            <Label htmlFor="gtm_container_id">Container ID</Label>
            <div className="relative">
              <Input
                id="gtm_container_id"
                placeholder="GTM-XXXXXXX"
                value={settings?.gtm_container_id || ""}
                onChange={(e) =>
                  setSettings((prev) => prev ? { ...prev, gtm_container_id: e.target.value.toUpperCase() } : null)
                }
                className={
                  settings?.gtm_container_id && !validateGTMId(settings.gtm_container_id)
                    ? "border-destructive"
                    : ""
                }
              />
              {settings?.gtm_container_id && validateGTMId(settings.gtm_container_id) && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {settings?.gtm_container_id && !validateGTMId(settings.gtm_container_id) && (
              <p className="text-xs text-destructive">
                Invalid format. Should be like GTM-XXXXXXX
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Privacy Considerations</p>
              <p>
                Analytics tracking is subject to user consent. The cookie consent banner will 
                respect user preferences for analytics cookies. Consider updating your privacy 
                policy to reflect the use of these tracking services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving} size="lg">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Analytics Settings
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsSettings;
