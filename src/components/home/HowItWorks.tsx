import { Search, FileText, Heart, Home } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Pets",
    description: "Explore our gallery of adorable pets looking for their forever homes.",
  },
  {
    icon: FileText,
    title: "Apply Online",
    description: "Fill out our simple adoption application with your details.",
  },
  {
    icon: Heart,
    title: "Meet & Greet",
    description: "Schedule a visit to meet your potential new family member.",
  },
  {
    icon: Home,
    title: "Welcome Home",
    description: "Complete the adoption and bring your new companion home!",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-medium tracking-wide uppercase text-sm">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            How Adoption Works
          </h2>
          <p className="text-muted-foreground">
            We've made the adoption process simple and stress-free. Here's how you can bring home your new best friend.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-border" />
              )}

              <div className="relative bg-card rounded-2xl p-8 text-center shadow-soft hover:shadow-medium transition-shadow">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                  <step.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>

                <h3 className="font-display text-xl font-semibold mb-3">
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
    </section>
  );
};

export default HowItWorks;
