import { Helmet } from "react-helmet-async";
import { Globe, ShieldCheck, Truck, HeartHandshake, Users, Calculator, FileCheck, Headphones } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const stats = [
  { icon: Globe, value: "93+", label: "Countries Served" },
  { icon: Users, value: "3,000+", label: "Partner Facilities" },
  { icon: Truck, value: "10,000+", label: "Successful Deliveries" },
  { icon: ShieldCheck, value: "100%", label: "Verified Partners" },
];

const commitments = [
  { icon: Calculator, title: "Transparent Pricing", desc: "Real-time shipping calculation based on distance, destination, and service type." },
  { icon: ShieldCheck, title: "Secure Payments", desc: "Multiple payment methods with verified proof-of-payment tracking." },
  { icon: FileCheck, title: "Verified Documentation", desc: "Full veterinary clearance, health certificates, and international compliance." },
  { icon: Headphones, title: "Ongoing Support", desc: "Dedicated support team assisting from reservation through post-delivery." },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Pawsfam - Global Pet Placement Network</title>
        <meta
          name="description"
          content="Pawsfam is an international pet placement and logistics network working with 3,000+ verified facilities worldwide. Transparent pricing, secure payments, and global delivery."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-16">
          {/* Hero */}
          <section className="container-custom mb-24">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="text-primary font-medium tracking-wide uppercase text-sm animate-fade-up opacity-0">
                Our Network
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold animate-fade-up opacity-0 stagger-1">
                A Global Pet Placement{" "}
                <span className="text-gradient">& Logistics Network</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed animate-fade-up opacity-0 stagger-2">
                We are an international pet placement and logistics network working with over
                3,000+ verified adoption centers, breeders, and care facilities worldwide.
                Our fully integrated system manages pet listings, buyer matching, secure reservations,
                international documentation, transportation coordination, and post-delivery support.
              </p>
            </div>
          </section>

          {/* Stats */}
          <section className="bg-muted/30 py-16 mb-24">
            <div className="container-custom">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center opacity-0 animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-display text-3xl font-bold">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="container-custom mb-24">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
              <span className="text-primary font-medium tracking-wide uppercase text-sm">
                How It Works
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                From Selection to Delivery
              </h2>
            </div>

            <div className="grid md:grid-cols-5 gap-6 max-w-4xl mx-auto">
              {[
                { step: "1", text: "Browse and select a pet available in a specific country" },
                { step: "2", text: "If local — arrange direct collection or domestic transport" },
                { step: "3", text: "If international — shipping is arranged based on your location" },
                { step: "4", text: "System calculates delivery pricing and timeline automatically" },
                { step: "5", text: "Dedicated support team assists throughout the entire process" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center opacity-0 animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Commitment */}
          <section className="container-custom mb-24">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
              <span className="text-primary font-medium tracking-wide uppercase text-sm">
                Our Commitment
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                What We Provide
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {commitments.map((item, index) => (
                <div
                  key={index}
                  className="text-center opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Note */}
          <section className="bg-muted/30 py-16">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <HeartHandshake className="w-12 h-12 text-primary mx-auto" />
                <h2 className="font-display text-2xl font-bold">Our Team</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our international operations team works across multiple regions to ensure safe placement,
                  compliance with local and international regulations, and smooth delivery worldwide.
                  Every member of our network is committed to the highest standards of animal welfare and customer service.
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

export default About;
