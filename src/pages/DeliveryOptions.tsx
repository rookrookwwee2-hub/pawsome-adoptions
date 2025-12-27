import { Helmet } from "react-helmet-async";
import { Car, Plane, UserCheck, Globe, Clock, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const deliveryOptions = [
  {
    title: "Ground Transport",
    icon: Car,
    price: "From $50",
    description: "Safe and comfortable ground transportation for your new companion.",
    details: [
      "Maximum 500 miles / 12 hours travel time",
      "Climate-controlled vehicle",
      "Regular rest stops",
      "Door-to-door service available",
    ],
    badge: "Most Affordable",
  },
  {
    title: "Air Cargo",
    icon: Plane,
    price: "USA $600 / Canada $950",
    description: "Professional airline shipping with full safety protocols.",
    details: [
      "USDA-approved travel crate included",
      "Climate-controlled cabin",
      "Direct flights when available",
      "Airport-to-airport service",
    ],
    badge: "Popular Choice",
  },
  {
    title: "In-Cabin Flight Nanny",
    icon: UserCheck,
    price: "$1,500",
    description: "Personal escort service with your pet traveling in-cabin.",
    details: [
      "Professional pet nanny accompanies your pet",
      "In-cabin travel (not cargo)",
      "Hand-to-hand delivery",
      "Real-time updates during travel",
    ],
    badge: "Premium Service",
  },
];

const DeliveryOptions = () => {
  return (
    <>
      <Helmet>
        <title>Delivery Options | Safe Pet Transport | PawHaven</title>
        <meta
          name="description"
          content="Choose from our safe and reliable pet delivery options. Ground transport, air cargo, or premium flight nanny service for your new companion."
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
                  Safe & Reliable
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
                  Delivery Options
                </h1>
                <p className="text-muted-foreground text-lg">
                  We offer multiple safe transportation methods to bring your new family member home, no matter where you are.
                </p>
              </div>
            </div>
          </section>

          {/* Global Indicator */}
          <section className="py-8">
            <div className="container-custom">
              <div className="bg-primary/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
                <Globe className="w-12 h-12 text-primary" />
                <div>
                  <h3 className="font-display text-xl font-semibold">Worldwide Delivery Available</h3>
                  <p className="text-muted-foreground">We ship to most countries. Estimated arrival: 1-4 weeks depending on location.</p>
                </div>
                <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">1-4 Weeks</span>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Options Grid */}
          <section className="py-16">
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
                      <p className="text-2xl font-bold text-primary mt-2">{option.price}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center mb-6">{option.description}</p>
                      <ul className="space-y-3">
                        {option.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Safety Note */}
          <section className="py-12 bg-accent/30">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-display text-2xl font-bold mb-4">Your Pet's Safety is Our Priority</h2>
                <p className="text-muted-foreground">
                  All our delivery methods include comprehensive health checks before travel, proper documentation, 
                  and compliance with all transportation regulations. Your pet's comfort and safety are guaranteed.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DeliveryOptions;
