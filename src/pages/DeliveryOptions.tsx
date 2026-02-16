import { Helmet } from "react-helmet-async";
import { Car, Plane, UserCheck, Globe, Clock, Shield, MapPin, Calculator, Route, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PetImageSection from "@/components/shared/PetImageSection";

const deliveryOptions = [
  {
    title: "Ground Transport",
    icon: Truck,
    pricing: "Distance-Based Pricing",
    description: "Live distance-based pricing calculated automatically from origin to destination.",
    details: [
      "Price calculated per KM based on total route distance",
      "Climate-controlled vehicle with monitored conditions",
      "Door-to-door service with regular rest stops",
      "Real-time distance calculator with travel duration",
      "Travel time automatically displayed based on route",
    ],
    badge: "Dynamic Pricing",
    extra: "Optional: Add a private ground companion escort. Companion pricing is calculated based on distance and updates automatically with route changes.",
  },
  {
    title: "Air Cargo",
    icon: Plane,
    pricing: "Route-Based Pricing",
    description: "Real-time flight pricing based on distance, destination country, and service type.",
    details: [
      "Airline-approved travel crate included",
      "Full documentation and customs handling",
      "Climate-controlled cargo section",
      "Airport-to-airport or door delivery options",
      "Estimated flight duration displayed automatically",
    ],
    badge: "International",
    extra: "Pricing includes Standard and Private VIP service tiers. All rates are calculated dynamically based on your selected origin and destination.",
  },
  {
    title: "In-Cabin Flight Companion",
    icon: UserCheck,
    pricing: "Distance & Route-Based",
    description: "Premium escort service with your pet traveling in-cabin alongside a professional companion.",
    details: [
      "Professional pet companion accompanies your pet in-cabin",
      "Price calculated based on flight distance and destination",
      "Hand-to-hand delivery with real-time updates",
      "Companion fee adjusts dynamically based on route",
      "Tiered pricing for short-haul vs. long-haul flights",
    ],
    badge: "Premium Service",
    extra: "Companion pricing is automatically calculated based on flight distance, destination country, and ticket class availability.",
  },
];

const DeliveryOptions = () => {
  return (
    <>
      <Helmet>
        <title>Delivery Options | Worldwide Pet Transport | Pawsfam</title>
        <meta
          name="description"
          content="International and domestic pet transportation with dynamic distance-based pricing. Ground transport, air cargo, and premium in-cabin companion service."
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
                  Worldwide Delivery
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
                  Dynamic Pet Transportation
                </h1>
                <p className="text-muted-foreground text-lg">
                  We provide international and domestic pet transportation with dynamic pricing based on origin, destination, distance, travel type, and companion options.
                </p>
              </div>
            </div>
          </section>

          {/* Global Indicator */}
          <section className="py-8">
            <div className="container-custom">
              <div className="bg-primary/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
                <Globe className="w-12 h-12 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-display text-xl font-semibold">Worldwide Delivery System</h3>
                  <p className="text-muted-foreground">All pricing is calculated in real-time based on origin & destination countries, distance, and selected services.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-medium text-sm">Domestic: 1–7 days</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-medium text-sm">International: 1–4 weeks</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How Pricing Works */}
          <section className="py-8">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <h2 className="font-display text-2xl font-bold mb-3">How Our Pricing Works</h2>
                <p className="text-muted-foreground">All delivery prices are calculated dynamically based on your specific route. Simply select your pet and destination on the pet details page to see live pricing.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: MapPin, label: "Origin & Destination", desc: "Country & state selection" },
                  { icon: Route, label: "Distance Calculation", desc: "KM/Miles auto-calculated" },
                  { icon: Calculator, label: "Live Price", desc: "Updates in real-time" },
                  { icon: Clock, label: "Travel Duration", desc: "Automatically estimated" },
                ].map((item, i) => (
                  <div key={i} className="bg-card rounded-xl p-4 text-center border">
                    <div className="w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-muted-foreground text-xs">{item.desc}</p>
                  </div>
                ))}
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
                      <p className="text-lg font-bold text-primary mt-2">{option.pricing}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center mb-4 text-sm">{option.description}</p>
                      <ul className="space-y-3 mb-4">
                        {option.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      {option.extra && (
                        <div className="bg-accent/50 rounded-lg p-3 mt-4">
                          <p className="text-xs text-muted-foreground">{option.extra}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <PetImageSection variant="dual" />

          {/* Safety Note */}
          <section className="py-12 bg-accent/30">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-display text-2xl font-bold mb-4">Safety & Compliance</h2>
                <p className="text-muted-foreground">
                  Every transport includes veterinary clearance, legal documentation, and compliance with international animal transport regulations.
                  We ensure safe, humane, and monitored travel at every stage.
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
