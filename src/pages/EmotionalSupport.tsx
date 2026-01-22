import { Helmet } from "react-helmet-async";
import { Heart, Brain, Smile, Users, Shield, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import PetImageSection from "@/components/shared/PetImageSection";

const benefits = [
  {
    icon: Heart,
    title: "Reduced Stress & Anxiety",
    description: "Studies show that interacting with pets can lower cortisol levels and reduce feelings of stress and anxiety.",
  },
  {
    icon: Brain,
    title: "Improved Mental Health",
    description: "Pet ownership is associated with lower rates of depression and improved overall mental wellbeing.",
  },
  {
    icon: Smile,
    title: "Increased Happiness",
    description: "The companionship of a pet triggers the release of oxytocin, the 'feel-good' hormone.",
  },
  {
    icon: Users,
    title: "Social Connection",
    description: "Pets help combat loneliness and can serve as social catalysts, helping owners connect with others.",
  },
];

const statistics = [
  { value: "74%", label: "of pet owners report mental health improvements", source: "NIMH" },
  { value: "60%", label: "reduction in anxiety symptoms", source: "CDC" },
  { value: "48%", label: "decrease in feelings of loneliness", source: "NIMH" },
  { value: "87%", label: "of owners feel more positive daily", source: "CDC" },
];

const EmotionalSupport = () => {
  return (
    <>
      <Helmet>
        <title>Emotional Support Animals | Mental Health Benefits | Pawsfam</title>
        <meta
          name="description"
          content="Discover the emotional and mental health benefits of pet companionship. Learn how cats and kittens can provide comfort, reduce stress, and improve wellbeing."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          {/* Hero Section */}
          <section className="pt-24 pb-16 bg-gradient-to-b from-accent/50 to-background">
            <div className="container-custom">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Emotional Support" },
                ]}
              />
              <div className="text-center max-w-3xl mx-auto mt-8">
                <span className="text-primary font-medium tracking-wide uppercase text-sm">
                  Healing Companionship
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
                  The Power of Pet Companionship
                </h1>
                <p className="text-muted-foreground text-lg">
                  Scientific research confirms what pet lovers have always known – the bond between humans and animals 
                  provides profound emotional and mental health benefits.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits Grid */}
          <section className="py-16">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl font-bold mb-4">Emotional Benefits</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Pets offer unconditional love and support that can transform your daily life.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-all opacity-0 animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="pt-8 pb-6">
                      <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <benefit.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <PetImageSection variant="dual" />

          {/* Statistics Section */}
          <section className="py-16 bg-primary/5">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl font-bold mb-4">The Science Speaks</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Research from NIMH (National Institute of Mental Health) and CDC (Centers for Disease Control) 
                  shows the measurable impact of pet ownership on mental health.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statistics.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-2xl p-6 text-center shadow-soft opacity-0 animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Source: {stat.source}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <PetImageSection variant="single" className="bg-muted/20" />

          {/* Testimonial */}
          <section className="py-16">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto bg-card rounded-3xl p-8 md:p-12 shadow-lg text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl font-display italic mb-6">
                  "My kitten has been an absolute blessing for my mental health. The unconditional love and 
                  companionship have helped me through some of my darkest days."
                </blockquote>
                <p className="text-muted-foreground">— Sarah M., Kitten Adopter</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-accent/30">
            <div className="container-custom text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-4">Ready to Experience the Benefits?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Start your journey to improved emotional wellbeing with a loving companion by your side.
              </p>
              <a href="/pets" className="btn-primary inline-block">
                Find Your Companion
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default EmotionalSupport;
