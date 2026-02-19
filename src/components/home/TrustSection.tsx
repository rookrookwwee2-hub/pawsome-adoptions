import { ShieldCheck, Award, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TrustSection = () => {
  const { t } = useTranslation();

  const trustOrganizations = [
    {
      name: "CFA",
      fullName: t("trust.cfaFull"),
      description: t("trust.cfaDesc"),
      icon: Award,
    },
    {
      name: "TICA",
      fullName: t("trust.ticaFull"),
      description: t("trust.ticaDesc"),
      icon: ShieldCheck,
    },
    {
      name: "USDA",
      fullName: t("trust.usdaFull"),
      description: t("trust.usdaDesc"),
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-16 bg-accent/30">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {t("trust.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("trust.description")}
          </p>
        </div>

        <TooltipProvider>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {trustOrganizations.map((org, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className="bg-card rounded-2xl p-8 text-center shadow-soft hover:shadow-medium transition-all cursor-pointer group">
                    <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                      <org.icon className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-primary mb-1">
                      {org.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {org.fullName}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p className="text-sm">{org.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t("trust.certifiedNote")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
