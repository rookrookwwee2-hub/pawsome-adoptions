import { useState } from "react";
import { Mail, Bell, Megaphone, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailPreferencesProps {
  userId: string;
  adoptionUpdates: boolean;
  newsletters: boolean;
  promotions: boolean;
  onUpdate: () => void;
}

export const EmailPreferences = ({
  userId,
  adoptionUpdates,
  newsletters,
  promotions,
  onUpdate,
}: EmailPreferencesProps) => {
  const [preferences, setPreferences] = useState({
    email_adoption_updates: adoptionUpdates,
    email_newsletters: newsletters,
    email_promotions: promotions,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(preferences)
        .eq("id", userId);

      if (error) throw error;
      toast.success("Email preferences updated!");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const preferenceItems = [
    {
      key: "email_adoption_updates" as const,
      icon: Bell,
      label: "Adoption Updates",
      description: "Get notified about your adoption applications and pet status",
    },
    {
      key: "email_newsletters" as const,
      icon: Mail,
      label: "Newsletters",
      description: "Receive our monthly newsletter with pet care tips and updates",
    },
    {
      key: "email_promotions" as const,
      icon: Megaphone,
      label: "Promotions",
      description: "Hear about special events, discounts, and partner offers",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Manage what emails you receive from us
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {preferenceItems.map(({ key, icon: Icon, label, description }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 p-4 bg-muted rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <Label htmlFor={key} className="text-base font-medium">
                  {label}
                </Label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <Switch
              id={key}
              checked={preferences[key]}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, [key]: checked }))
              }
            />
          </div>
        ))}

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
