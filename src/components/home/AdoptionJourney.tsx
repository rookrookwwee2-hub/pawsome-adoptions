import { Search, ClipboardCheck, Plane, Stethoscope, Home } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover & Reserve",
    description: "Explore our carefully raised kittens, each with a unique personality. Click 'Reserve Me' once you find the perfect match. Full payment or reservation deposit options available.",
  },
  {
    icon: ClipboardCheck,
    title: "Match Review & Approval",
    description: "After reservation, complete a short lifestyle questionnaire. Our adoption specialists and breeders review it to ensure the best match.",
  },
  {
    icon: Plane,
    title: "Plan Your Kitten's Arrival",
    description: "We coordinate safe pickup or delivery and provide preparation guidance for your new family member.",
  },
  {
    icon: Stethoscope,
    title: "Veterinary Clearance",
    description: "Each kitten must be at least 16 weeks old, properly vaccinated, FIV/FELV negative, vet-checked, and issued a valid health certificate.",
  },
  {
    icon: Home,
    title: "Welcome Home",
    description: "Receive your kitten, medical records, and celebrate this special moment with us. Your journey together begins!",
  },
];

const AdoptionJourney = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-medium tracking-wide uppercase text-sm">
            Your Path to Companionship
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Your Adoption Journey
          </h2>
          <p className="text-muted-foreground">
            We've designed a seamless, caring process to ensure you and your new companion are perfectly matched.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative bg-card rounded-2xl p-6 text-center shadow-soft hover:shadow-medium transition-all h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm z-10">
                    {index + 1}
                  </div>

                  {/* Icon */}
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
