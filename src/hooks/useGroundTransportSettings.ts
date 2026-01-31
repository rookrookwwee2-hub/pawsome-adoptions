import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GroundTransportSettings {
  id: string;
  base_price: number;
  price_per_km: number;
  price_per_mile: number;
  standard_multiplier: number;
  private_multiplier: number;
  companion_base_fee: number;
  companion_per_km: number;
  companion_max_fee: number;
  max_ground_distance_km: number;
  estimated_speed_kmh: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function useGroundTransportSettings() {
  return useQuery({
    queryKey: ["ground-transport-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ground_transport_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching ground transport settings:", error);
        throw error;
      }

      return data as GroundTransportSettings | null;
    },
  });
}

export function useUpdateGroundTransportSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<GroundTransportSettings>) => {
      // First get the existing settings ID
      const { data: existing } = await supabase
        .from("ground_transport_settings")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (!existing) {
        throw new Error("No ground transport settings found");
      }

      const { data, error } = await supabase
        .from("ground_transport_settings")
        .update(settings)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ground-transport-settings"] });
      toast.success("Ground transport settings updated");
    },
    onError: (error) => {
      console.error("Error updating ground transport settings:", error);
      toast.error("Failed to update settings");
    },
  });
}
