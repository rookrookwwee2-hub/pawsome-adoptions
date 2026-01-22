import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SocialLink {
  url: string;
  enabled: boolean;
}

export interface SocialLinks {
  telegram: SocialLink;
  whatsapp: SocialLink;
  instagram: SocialLink;
  facebook: SocialLink;
  snapchat: SocialLink;
}

const defaultSocialLinks: SocialLinks = {
  telegram: { url: "", enabled: false },
  whatsapp: { url: "", enabled: false },
  instagram: { url: "", enabled: false },
  facebook: { url: "", enabled: false },
  snapchat: { url: "", enabled: false },
};

export const useSocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocialLinks);
  const [loading, setLoading] = useState(true);

  const fetchSocialLinks = async () => {
    const { data, error } = await supabase
      .from("payment_settings")
      .select("setting_value")
      .eq("setting_key", "social_links")
      .maybeSingle();

    if (error) {
      console.error("Error fetching social links:", error);
      setLoading(false);
      return;
    }

    if (data?.setting_value) {
      setSocialLinks(data.setting_value as unknown as SocialLinks);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const saveSocialLinks = async (links: SocialLinks) => {
    const { error } = await supabase
      .from("payment_settings")
      .upsert({ 
        setting_key: "social_links", 
        setting_value: links as unknown as never 
      }, { 
        onConflict: "setting_key" 
      });

    if (error) {
      throw error;
    }

    setSocialLinks(links);
  };

  const enabledLinks = Object.entries(socialLinks).filter(
    ([_, link]) => link.enabled && link.url
  );

  return { socialLinks, loading, saveSocialLinks, refetch: fetchSocialLinks, enabledLinks };
};
