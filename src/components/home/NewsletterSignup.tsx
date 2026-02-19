import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const emailSchema = z.string().trim().email({ message: t("newsletter.invalidEmail") });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        title: t("newsletter.invalidEmail"),
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: validation.data });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: t("newsletter.alreadySubscribed"),
            description: t("newsletter.alreadySubscribedDesc"),
          });
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        setEmail("");
        toast({
          title: t("newsletter.success"),
          description: t("newsletter.successDesc"),
        });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: t("newsletter.failed"),
        description: t("newsletter.failedDesc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{t("newsletter.subscribed")}</h2>
            </div>
            <p className="text-muted-foreground">
              {t("newsletter.subscribedDesc")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="h-8 w-8 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t("newsletter.stayUpdated")}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {t("newsletter.description")}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={isLoading}
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("newsletter.subscribing")}
                </>
              ) : (
                t("newsletter.subscribe")
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            {t("newsletter.privacy")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
