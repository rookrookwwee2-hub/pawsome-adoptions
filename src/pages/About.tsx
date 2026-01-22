import { Helmet } from "react-helmet-async";
import { Heart, Users, Home, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const stats = [
  { icon: Heart, value: "5,000+", label: "Pets Adopted" },
  { icon: Users, value: "50+", label: "Partner Shelters" },
  { icon: Home, value: "10,000+", label: "Happy Families" },
  { icon: Award, value: "5", label: "Years of Service" },
];

const team = [
  {
    name: "Emily Rodriguez",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
  },
  {
    name: "David Chen",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
  },
  {
    name: "Sarah Thompson",
    role: "Adoption Coordinator",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
  },
  {
    name: "Michael Park",
    role: "Veterinary Advisor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
  },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Pawsfam - Pet Adoption Platform</title>
        <meta
          name="description"
          content="Learn about Pawsfam's mission to connect loving families with pets in need. We've helped thousands of animals find their forever homes."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-16">
          {/* Hero */}
          <section className="container-custom mb-24">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="text-primary font-medium tracking-wide uppercase text-sm animate-fade-up opacity-0">
                Our Story
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold animate-fade-up opacity-0 stagger-1">
                Every Pet Deserves a{" "}
                <span className="text-gradient">Loving Home</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed animate-fade-up opacity-0 stagger-2">
                Founded in 2020, Pawsfam was born from a simple belief: every
                animal deserves love, care, and a family to call their own. We
                work tirelessly to connect pets with their perfect forever families.
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

          {/* Mission */}
          <section className="container-custom mb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-primary font-medium tracking-wide uppercase text-sm">
                  Our Mission
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  Creating Happy Endings, One Paw at a Time
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Pawsfam, we believe that the bond between humans and animals
                  is transformative. Our mission is to make pet adoption accessible,
                  transparent, and joyful for everyone involved.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We partner with over 50 verified shelters across the country,
                  ensuring that every pet on our platform has been properly cared
                  for and is ready for their new home. Our thorough vetting process
                  means you can adopt with confidence.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop"
                    alt="Happy dog with family"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/10 rounded-3xl -z-10" />
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
              <span className="text-primary font-medium tracking-wide uppercase text-sm">
                Meet the Team
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                The People Behind Pawsfam
              </h2>
              <p className="text-muted-foreground">
                A passionate team dedicated to making every adoption a success story.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="text-center group opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative mb-4 overflow-hidden rounded-2xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-display text-xl font-semibold">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground">{member.role}</p>
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
