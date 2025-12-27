import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Scale,
  Heart,
  CreditCard,
  Truck,
  AlertTriangle,
  RefreshCw,
  Gavel,
} from "lucide-react";

const TermsConditions = () => {
  const lastUpdated = "December 27, 2024";

  const sections = [
    {
      icon: Scale,
      title: "Acceptance of Terms",
      content: `By accessing and using PawfectMatch's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of any changes.`,
    },
    {
      icon: Heart,
      title: "Adoption Process & Requirements",
      content: `All adopters must be at least 18 years of age and provide valid identification. The adoption process includes completing an application, potential home checks, and agreeing to our adoption contract. We reserve the right to refuse any adoption application at our sole discretion. Approved adopters agree to provide proper care, nutrition, veterinary attention, and a safe living environment for adopted pets. Pets must not be used for breeding, fighting, or any illegal purposes.`,
    },
    {
      icon: CreditCard,
      title: "Fees & Payments",
      content: `All adoption fees are clearly displayed and must be paid in full before the pet is released to the adopter. We accept bank transfers (UK, USA, EU) and USDT cryptocurrency payments. Reservation deposits (30% of adoption fee) are non-refundable unless the adoption is cancelled by PawfectMatch. Full payment must be received and verified before delivery arrangements are made. All prices are subject to change without notice.`,
    },
    {
      icon: Truck,
      title: "Delivery & Transportation",
      content: `We offer various delivery options including ground transport, flight nanny service, and air cargo. Delivery fees are separate from adoption fees and vary based on location and method. PawfectMatch coordinates safe transport but is not liable for delays caused by weather, airline policies, or other circumstances beyond our control. Adopters are responsible for ensuring they can legally receive the pet in their jurisdiction.`,
    },
    {
      icon: RefreshCw,
      title: "Health Guarantee & Returns",
      content: `All pets come with a health certificate from a licensed veterinarian. We provide a genetic health guarantee for applicable breeds as specified in the pet listing. If a pet is found to have a pre-existing condition within 72 hours of delivery, contact us immediately with veterinary documentation. We do not offer refunds but may provide a replacement pet in verified cases of undisclosed health issues. Pets must never be surrendered to shelters; contact us for re-homing assistance.`,
    },
    {
      icon: AlertTriangle,
      title: "Limitation of Liability",
      content: `PawfectMatch provides pets and services "as is" without warranties beyond those expressly stated. We are not liable for any indirect, incidental, or consequential damages arising from the adoption or ownership of pets. Our total liability shall not exceed the amount paid for the adoption. By adopting, you assume all risks associated with pet ownership, including but not limited to property damage, injury, or illness.`,
    },
    {
      icon: Gavel,
      title: "Governing Law & Disputes",
      content: `These Terms and Conditions shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of our services shall be resolved through good-faith negotiation. If negotiation fails, disputes may be submitted to binding arbitration. You agree to waive any right to a jury trial or participation in class action lawsuits.`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Terms & Conditions - PawfectMatch</title>
        <meta
          name="description"
          content="Read PawfectMatch's Terms and Conditions for pet adoption services. Understand your rights and responsibilities when adopting a pet."
        />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Please read these terms carefully before using our pet adoption
              services. They outline your rights and responsibilities as an adopter.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Important Notice */}
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h2 className="font-display text-lg font-semibold mb-2">
                    Important Notice
                  </h2>
                  <p className="text-muted-foreground">
                    By completing an adoption through PawfectMatch, you enter into a
                    legally binding agreement. Please ensure you understand all terms
                    before proceeding. If you have questions, contact us before
                    submitting your adoption application.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display text-xl font-semibold mb-3">
                        {index + 1}. {section.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* User Conduct */}
          <Card className="mt-6">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold mb-4">
                8. User Conduct
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When using our website and services, you agree to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Provide accurate and truthful information in all applications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Not misrepresent your identity or intentions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Not use our services for any unlawful purpose</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Not attempt to circumvent security measures</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Respect our intellectual property and content ownership</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mt-6 bg-muted/50">
            <CardContent className="p-6 md:p-8 text-center">
              <h2 className="font-display text-xl font-semibold mb-2">
                Questions About These Terms?
              </h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions or concerns about these Terms and Conditions,
                please contact our team before proceeding with an adoption.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                Contact Us →
              </a>
            </CardContent>
          </Card>

          {/* Agreement Statement */}
          <div className="mt-8 p-6 border rounded-xl text-center">
            <p className="text-sm text-muted-foreground">
              By using our services or completing an adoption, you confirm that you
              have read, understood, and agree to be bound by these Terms and
              Conditions and our{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsConditions;
