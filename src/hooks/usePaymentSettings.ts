import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UsdtSettings {
  network: string;
  walletAddress: string;
  note: string;
}

interface BankDetail {
  label: string;
  value: string;
}

interface BankSettings {
  id: string;
  region: string;
  subtitle: string;
  currency: string;
  details: BankDetail[];
}

export const usePaymentSettings = () => {
  const [usdtSettings, setUsdtSettings] = useState<UsdtSettings | null>(null);
  const [bankSettings, setBankSettings] = useState<BankSettings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("payment_settings")
        .select("*");

      if (error) {
        console.error("Error fetching payment settings:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const usdtData = data.find((s) => s.setting_key === "usdt");
        const bankData = data.find((s) => s.setting_key === "bank_details");

        if (usdtData) {
          setUsdtSettings(usdtData.setting_value as unknown as UsdtSettings);
        }
        if (bankData) {
          setBankSettings(bankData.setting_value as unknown as BankSettings[]);
        }
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  return { usdtSettings, bankSettings, loading };
};
