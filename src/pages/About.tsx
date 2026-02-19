import { Helmet } from "react-helmet-async";
import { Globe, Shield, DollarSign, HeadphonesIcon, Truck, FileCheck, Users, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Globe, value: "3,000+", label: t("about.verifiedPartners") },
    { icon: Users, value: "93+", label: t("about.countriesCovered") },
    { icon: Heart, value: "10,000+", label: t("about.happyFamilies") },
    { icon: Truck, value: "24/7", label: t("about.logisticsSupport") },
  ];

  const commitments = [
    { icon: DollarSign, title: t("about.transparentPricing"), description: t("about.transparentPricingDesc") },
    { icon: Shield, title: t("about.verifiedDocs"), description: t("about.verifiedDocsDesc") },
    { icon: HeadphonesIcon, title: t("about.ongoingSupport"), description: t("about.ongoingSupportDesc") },
    { icon: FileCheck, title: t("about.securePayments"), description: t("about.securePaymentsDesc") },
  ];

  return (
    <>
      <Helmet>
        <title>{t("about.pageTitle")}</title>
        <meta name="description" content={t("about.description")} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-16">
          {/* Hero */}
          <section className="container-custom mb-24">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="text-primary font-medium tracking-wide uppercase text-sm animate-fade-up opacity-0">
                {t("about.label")}
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold animate-fade-up opacity-0 stagger-1">
                {t("about.title")}{" "}
                <span className="text-gradient">{t("about.titleHighlight")}</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed animate-fade-up opacity-0 stagger-2">
                {t("about.description")}
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
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-primary font-medium tracking-wide uppercase text-sm">
                  {t("about.howItWorksLabel")}
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  {t("about.howItWorksTitle")}
                </h2>
                <div className="space-y-4">
                  {[
                    t("about.step1"),
                    t("about.step2"),
                    t("about.step3"),
                    t("about.step4"),
                    t("about.step5"),
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <p className="text-muted-foreground leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop"
                    alt="Happy pet with family"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/10 rounded-3xl -z-10" />
              </div>
            </div>
          </section>

          {/* Our Commitment */}
          <section className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
              <span className="text-primary font-medium tracking-wide uppercase text-sm">
                {t("about.commitmentLabel")}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                {t("about.commitmentTitle")}
              </h2>
              <p className="text-muted-foreground">
                {t("about.commitmentDesc")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {commitments.map((item, index) => (
                <div
                  key={index}
                  className="text-center group opacity-0 animate-fade-up p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
