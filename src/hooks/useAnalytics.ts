import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsSettings {
  ga_measurement_id: string;
  ga_enabled: boolean;
  gtm_container_id: string;
  gtm_enabled: boolean;
}

export const useAnalytics = () => {
  const [settings, setSettings] = useState<AnalyticsSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("analytics_settings")
          .select("ga_measurement_id, ga_enabled, gtm_container_id, gtm_enabled")
          .limit(1)
          .single();

        if (error) throw error;
        setSettings(data as AnalyticsSettings);
      } catch (error) {
        console.error("Error fetching analytics settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};
