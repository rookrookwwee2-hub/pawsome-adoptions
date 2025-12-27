import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "December 27, 2024";

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal identification information (name, email address, phone number, mailing address)",
        "Payment and billing information for processing adoption fees",
        "Pet preferences and adoption application details",
        "Communication records between you and our team",
        "Website usage data and cookies for improving your experience",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Process pet adoption applications and facilitate adoptions",
        "Communicate with you about your applications and inquiries",
        "Send important updates about pets you've shown interest in",
        "Improve our website and services based on user feedback",
        "Comply with legal obligations and protect our rights",
      ],
    },
    {
      icon: Lock,
      title: "Data Protection & Security",
      content: [
        "All data transmissions are encrypted using SSL/TLS technology",
        "Payment information is processed through secure, PCI-compliant services",
        "Access to personal data is restricted to authorized personnel only",
        "Regular security audits and updates to protect against vulnerabilities",
        "Data backups are encrypted and stored securely",
      ],
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access: Request a copy of the personal data we hold about you",
        "Correction: Ask us to correct any inaccurate or incomplete data",
        "Deletion: Request deletion of your personal data (subject to legal requirements)",
        "Objection: Object to certain types of data processing",
        "Portability: Request your data in a portable format",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy - PawfectMatch</title>
        <meta
          name="description"
          content="Learn how PawfectMatch protects your privacy and handles your personal data. Read our comprehensive privacy policy."
        />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect,
              use, and protect your personal information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                PawfectMatch ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy describes how we collect, use, disclose,
                and safeguard your information when you visit our website and use our
                pet adoption services. Please read this privacy policy carefully. If
                you do not agree with the terms of this privacy policy, please do not
                access the site.
              </p>
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
                      <h2 className="font-display text-xl font-semibold mb-4">
                        {section.title}
                      </h2>
                      <ul className="space-y-3">
                        {section.content.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-muted-foreground"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cookies Section */}
          <Card className="mt-6">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold mb-4">
                Cookies & Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your
                browsing experience, analyze site traffic, and understand where our
                visitors come from. Cookies are small files stored on your device that
                help us remember your preferences and provide personalized content.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You can choose to disable cookies through your browser settings.
                However, please note that some features of our website may not function
                properly without cookies.
              </p>
            </CardContent>
          </Card>

          {/* Third Party Section */}
          <Card className="mt-6">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold mb-4">
                Third-Party Services
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may use third-party services to process payments, analyze website
                traffic, and improve our services. These third parties have access to
                your personal information only to perform specific tasks on our behalf
                and are obligated to protect your information.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information
                to outside parties without your consent, except as described in this
                policy or as required by law.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="mt-6">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold mb-4">
                Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do
                not knowingly collect personal information from children. If you are a
                parent or guardian and believe your child has provided us with personal
                information, please contact us so we can delete such information.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold mb-2">
                    Questions About This Policy?
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about this Privacy Policy or our data
                    practices, please don't hesitate to contact us.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center text-primary font-medium hover:underline"
                  >
                    Contact Us →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Updates */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              We may update this Privacy Policy from time to time. Any changes will be
              posted on this page with an updated revision date.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
