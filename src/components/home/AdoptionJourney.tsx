import { Search, ClipboardCheck, Plane, Stethoscope, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

const AdoptionJourney = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Search,
      title: t("journey.step1Title"),
      description: t("journey.step1Desc"),
    },
    {
      icon: ClipboardCheck,
      title: t("journey.step2Title"),
      description: t("journey.step2Desc"),
    },
    {
      icon: Plane,
      title: t("journey.step3Title"),
      description: t("journey.step3Desc"),
    },
    {
      icon: Stethoscope,
      title: t("journey.step4Title"),
      description: t("journey.step4Desc"),
    },
    {
      icon: Home,
      title: t("journey.step5Title"),
      description: t("journey.step5Desc"),
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-medium tracking-wide uppercase text-sm">
            {t("journey.label")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            {t("journey.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("journey.description")}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative bg-card rounded-2xl p-6 text-center shadow-soft hover:shadow-medium transition-all h-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm z-10">
                    {index + 1}
                  </div>

                  <div className="w-14 h-14 mx-auto mb-4 mt-2 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                    <step.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>

                  <h3 className="font-display text-lg font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdoptionJourney;
