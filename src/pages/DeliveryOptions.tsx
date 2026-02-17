import { Helmet } from "react-helmet-async";
import { Car, Plane, UserCheck, Globe, Clock, Shield, MapPin, Route, DollarSign, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PetImageSection from "@/components/shared/PetImageSection";

const deliveryOptions = [
  {
    title: "Ground Transport",
    icon: Car,
    pricing: "Distance-Based Pricing",
    description: "Live distance-based pricing calculated automatically from origin to destination.",
    details: [
      "Price calculated automatically based on total KM",
      "Climate-controlled vehicle with GPS tracking",
      "Door-to-door service with rest stops every few hours",
      "Real-time distance calculator on pet page",
      "Travel duration automatically displayed",
    ],
    badge: "Domestic & Regional",
    extra: "Optional: Add a private escort companion — price calculated dynamically based on route distance.",
  },
  {
    title: "Air Cargo",
    icon: Plane,
    pricing: "Real-Time Flight Pricing",
    description: "International & domestic flight pricing calculated based on distance and destination.",
    details: [
      "Airline-approved travel crate included",
      "Full documentation & customs handling",
      "Climate-controlled cargo section",
      "Airport-to-airport or door delivery options",
      "Estimated flight duration displayed automatically",
    ],
    badge: "International & Domestic",
    extra: null,
  },
  {
    title: "In-Cabin Flight Companion",
    icon: UserCheck,
    pricing: "Route-Based Pricing",
    description: "Personal handler travels in-cabin with your pet — price calculated based on flight distance and destination.",
    details: [
      "Professional pet handler accompanies your pet",
      "In-cabin travel (not cargo hold)",
      "Hand-to-hand delivery at destination",
      "Real-time updates during travel",
      "Price updates dynamically based on route",
    ],
    badge: "Premium Service",
    extra: null,
  },
];

const DeliveryOptions = () => {
  return (
    <>
      <Helmet>
        <title>Delivery Options | Worldwide Pet Transport | Pawsfam</title>
        <meta
          name="description"
          content="Dynamic distance-based pet transportation worldwide. Ground transport, air cargo, and premium flight companion service with real-time pricing."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          {/* Hero Section */}
          <section className="pt-24 pb-12 bg-gradient-to-b from-accent/50 to-background">
            <div className="container-custom">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Delivery Options" },
                ]}
              />
              <div className="text-center max-w-3xl mx-auto mt-8">
                <span className="text-primary font-medium tracking-wide uppercase text-sm">
                  Worldwide Transport
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
                  Delivery Options
                </h1>
                <p className="text-muted-foreground text-lg">
                  We provide international and domestic pet transportation with dynamic pricing based on origin, destination, distance, and travel type.
                </p>
              </div>
            </div>
          </section>

          {/* Global Indicator */}
          <section className="py-8">
            <div className="container-custom">
              <div className="bg-primary/10 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left mb-6">
                  <Globe className="w-12 h-12 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-xl font-semibold">Worldwide Delivery System</h3>
                    <p className="text-muted-foreground">
                      Pricing is calculated dynamically based on origin &amp; destination country/state, total distance, selected travel type, and companion options.
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-card rounded-lg px-4 py-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium block">Domestic Delivery</span>
                      <span className="text-sm text-muted-foreground">1–7 days depending on distance</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-card rounded-lg px-4 py-3">
                    <Plane className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium block">International Delivery</span>
                      <span className="text-sm text-muted-foreground">1–4 weeks (customs &amp; flight availability)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Options Grid */}
          <section className="py-8">
            <div className="container-custom">
              <div className="grid md:grid-cols-3 gap-8">
                {deliveryOptions.map((option, index) => (
                  <Card
                    key={index}
                    className="relative overflow-hidden hover:shadow-lg transition-all opacity-0 animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Badge className="absolute top-4 right-4">{option.badge}</Badge>
                    <CardHeader className="text-center pt-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <option.icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="font-display text-xl">{option.title}</CardTitle>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-primary font-semibold">{option.pricing}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center mb-6">{option.description}</p>
                      <ul className="space-y-3">
                        {option.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      {option.extra && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                          <p className="text-sm text-muted-foreground flex items-start gap-2">
                            <UserCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {option.extra}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* How Pricing Works */}
          <section className="py-12 bg-muted/30">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">How Our Pricing Works</h2>
                <p className="text-muted-foreground">
                  All prices are calculated in real-time on the pet details page when you select your destination.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: MapPin, label: "Select Destination", desc: "Choose your country & state" },
                  { icon: Route, label: "Distance Calculated", desc: "Automatic KM/Miles calculation" },
                  { icon: DollarSign, label: "Price Generated", desc: "Based on distance & method" },
                  { icon: Clock, label: "Time Estimated", desc: "Travel duration displayed" },
                ].map((step, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-semibold text-sm">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <PetImageSection variant="dual" />

          {/* Safety Note */}
          <section className="py-12 bg-accent/30">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto text-center">
                <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold mb-4">Safety &amp; Compliance</h2>
                <p className="text-muted-foreground">
                  Every transport includes veterinary clearance, legal documentation, and compliance with international animal transport regulations. We ensure safe, humane, and monitored travel at every stage.
                </p>
              </div>
            </div>
          </section>

          <PetImageSection variant="single" className="bg-muted/20" />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DeliveryOptions;
