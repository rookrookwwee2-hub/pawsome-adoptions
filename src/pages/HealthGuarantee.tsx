import { Helmet } from "react-helmet-async";
import { Shield, Syringe, Heart, FileCheck, Dna, Stethoscope, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PetImageSection from "@/components/shared/PetImageSection";

const guarantees = [
  {
    icon: Syringe,
    title: "Comprehensive Vaccinations",
    description: "All pets receive age-appropriate vaccinations including FVRCP, Rabies, and more.",
    included: true,
  },
  {
    icon: Dna,
    title: "1-Year Genetic Health Guarantee",
    description: "Protection against hereditary conditions for the first year of your pet's life.",
    included: true,
  },
  {
    icon: Stethoscope,
    title: "HCM Testing",
    description: "Hypertrophic Cardiomyopathy screening for applicable breeds.",
    included: true,
  },
  {
    icon: FileCheck,
    title: "Veterinary Health Certificate",
    description: "Official health certification from licensed veterinarians.",
    included: true,
  },
];

const optionalPlans = [
  {
    title: "Extended Genetic Health Guarantee",
    duration: "3 Years",
    description: "Extended coverage for genetic and hereditary conditions.",
    price: "$299",
  },
  {
    title: "FIP Protection Plan",
    duration: "36 Months",
    description: "Comprehensive protection against Feline Infectious Peritonitis.",
    price: "$349",
  },
];

const healthChecklist = [
  "FIV/FeLV Tested Negative",
  "Complete Deworming Treatment",
  "Microchipped for Identification",
  "Spayed/Neutered (age appropriate)",
  "Complete Medical Records",
  "Pet Passport for Travel",
];

const HealthGuarantee = () => {
  return (
    <>
      <Helmet>
        <title>Health Guarantee | Vaccinations & Genetic Testing | Pawsfam</title>
        <meta
          name="description"
          content="Our comprehensive health guarantee includes vaccinations, genetic testing, HCM screening, and optional extended protection plans for your new pet."
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
                  { label: "Health Guarantee" },
                ]}
              />
              <div className="text-center max-w-3xl mx-auto mt-8">
                <span className="text-primary font-medium tracking-wide uppercase text-sm">
                  Your Peace of Mind
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
                  Health Guarantee
                </h1>
                <p className="text-muted-foreground text-lg">
                  Every pet from Pawsfam comes with comprehensive health coverage and documentation, 
                  ensuring you receive a happy, healthy companion.
                </p>
              </div>
            </div>
          </section>

          {/* Standard Guarantees */}
          <section className="py-16">
            <div className="container-custom">
              <div className="text-center mb-12">
                <Badge className="mb-4">Included With Every Adoption</Badge>
                <h2 className="font-display text-3xl font-bold">Standard Health Coverage</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {guarantees.map((item, index) => (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-all opacity-0 animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="pt-8 pb-6">
                      <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <item.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <PetImageSection variant="dual" />

          {/* Health Checklist */}
          <section className="py-16 bg-accent/30">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl font-bold mb-4">Complete Health Checklist</h2>
                  <p className="text-muted-foreground">
                    Before leaving for their new home, every pet passes our comprehensive health screening.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {healthChecklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-card rounded-lg p-4 shadow-soft"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <PetImageSection variant="single" className="bg-muted/20" />

          {/* Optional Plans */}
          <section className="py-16">
            <div className="container-custom">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Optional Add-Ons</Badge>
                <h2 className="font-display text-3xl font-bold">Extended Protection Plans</h2>
                <p className="text-muted-foreground mt-2">
                  Additional coverage options for extra peace of mind.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {optionalPlans.map((plan, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-primary/5">
                      <Badge className="w-fit">{plan.duration}</Badge>
                      <CardTitle className="font-display text-xl mt-2">{plan.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground mb-4">{plan.description}</p>
                      <p className="text-2xl font-bold text-primary">{plan.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Breeder Standards */}
          <section className="py-16 bg-primary/5">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-display text-3xl font-bold mb-4">Our Breeder Standards</h2>
                <p className="text-muted-foreground mb-8">
                  We work exclusively with certified, ethical breeders who meet our rigorous standards for animal welfare, 
                  health testing, and breeding practices. Every breeder is regularly inspected and must maintain 
                  compliance with CFA, TICA, and USDA guidelines.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="text-sm py-2 px-4">CFA Certified</Badge>
                  <Badge variant="outline" className="text-sm py-2 px-4">TICA Registered</Badge>
                  <Badge variant="outline" className="text-sm py-2 px-4">USDA Licensed</Badge>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HealthGuarantee;
