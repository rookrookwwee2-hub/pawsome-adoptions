import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ApiSecret {
  id: string;
  key_name: string;
  key_value: string;
  description: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useApiSecrets = () => {
  const [secrets, setSecrets] = useState<ApiSecret[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSecrets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("api_secrets")
      .select("*")
      .order("key_name");

    if (error) {
      console.error("Error fetching API secrets:", error);
      toast({
        title: "Error",
        description: "Failed to load API secrets",
        variant: "destructive",
      });
    } else {
      setSecrets(data || []);
    }
    setLoading(false);
  };

  const addSecret = async (
    keyName: string,
    keyValue: string,
    description?: string
  ) => {
    const { error } = await supabase.from("api_secrets").insert({
      key_name: keyName,
      key_value: keyValue,
      description: description || null,
      is_enabled: true,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: `API key "${keyName}" added successfully`,
    });
    await fetchSecrets();
    return true;
  };

  const updateSecret = async (
    id: string,
    updates: Partial<Pick<ApiSecret, "key_value" | "description" | "is_enabled">>
  ) => {
    const { error } = await supabase
      .from("api_secrets")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "API key updated successfully",
    });
    await fetchSecrets();
    return true;
  };

  const toggleSecret = async (id: string, isEnabled: boolean) => {
    return updateSecret(id, { is_enabled: isEnabled });
  };

  const deleteSecret = async (id: string) => {
    const { error } = await supabase.from("api_secrets").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "API key deleted successfully",
    });
    await fetchSecrets();
    return true;
  };

  const getSecret = async (keyName: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("api_secrets")
      .select("key_value, is_enabled")
      .eq("key_name", keyName)
      .single();

    if (error || !data || !data.is_enabled) {
      return null;
    }

    return data.key_value;
  };

  const isSecretEnabled = async (keyName: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("api_secrets")
      .select("is_enabled")
      .eq("key_name", keyName)
      .single();

    if (error || !data) {
      return false;
    }

    return data.is_enabled;
  };

  useEffect(() => {
    fetchSecrets();
  }, []);

  return {
    secrets,
    loading,
    fetchSecrets,
    addSecret,
    updateSecret,
    toggleSecret,
    deleteSecret,
    getSecret,
    isSecretEnabled,
  };
};
