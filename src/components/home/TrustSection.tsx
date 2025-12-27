import { ShieldCheck, Award, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const trustOrganizations = [
  {
    name: "CFA",
    fullName: "Cat Fanciers' Association",
    description: "The world's largest registry of pedigreed cats, setting the standard for cat breeds since 1906.",
    icon: Award,
  },
  {
    name: "TICA",
    fullName: "The International Cat Association",
    description: "The world's largest genetic registry of pedigreed and household cats, promoting responsible cat ownership.",
    icon: ShieldCheck,
  },
  {
    name: "USDA",
    fullName: "United States Department of Agriculture",
    description: "Federal regulatory agency ensuring animal welfare standards and health certifications for pet transportation.",
    icon: CheckCircle,
  },
];

const TrustSection = () => {
  return (
    <section className="py-16 bg-accent/30">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            We Prioritize Ethical Breeding and Animal Welfare
          </h2>
          <p className="text-muted-foreground">
            Our commitment to excellence is backed by industry-leading organizations that set the highest standards for animal care and breeding practices.
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
            All our breeders are certified and regularly inspected to ensure the highest standards of care.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
