import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AirCargoSettings {
  id: string;
  base_price: number;
  price_per_km: number;
  price_per_mile: number;
  standard_multiplier: number;
  private_multiplier: number;
  companion_base_fee: number;
  companion_per_km: number;
  companion_max_fee: number;
  long_flight_threshold_km: number;
  long_flight_companion_fee: number;
  average_speed_kmh: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function useAirCargoSettings() {
  return useQuery({
    queryKey: ["air-cargo-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("air_cargo_settings" as any)
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching air cargo settings:", error);
        throw error;
      }

      return data as unknown as AirCargoSettings | null;
    },
  });
}

export function useUpdateAirCargoSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<AirCargoSettings>) => {
      const { data: existing } = await supabase
        .from("air_cargo_settings" as any)
        .select("id")
        .limit(1)
        .maybeSingle();

      if (!existing) {
        throw new Error("No air cargo settings found");
      }

      const { data, error } = await supabase
        .from("air_cargo_settings" as any)
        .update(settings as any)
        .eq("id", (existing as any).id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["air-cargo-settings"] });
      toast.success("Air cargo settings updated");
    },
    onError: (error) => {
      console.error("Error updating air cargo settings:", error);
      toast.error("Failed to update settings");
    },
  });
}
