import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const stats = [
    { icon: Heart, value: "5,000+", label: "Pets Adopted" },
    { icon: Shield, value: "100%", label: "Verified Shelters" },
    { icon: Clock, value: "24/7", label: "Support" },
  ];

  const familyImages = [
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1544568100-847a948585b9?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Family Pet Images */}
      <div className="absolute inset-0 -z-10">
        {/* Image Collage Behind Title */}
        <div className="absolute top-16 left-0 right-0 h-[500px] lg:h-[600px] overflow-hidden">
          <div className="grid grid-cols-3 gap-2 opacity-20 dark:opacity-15">
            {familyImages.map((src, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl ${
                  index % 2 === 0 ? 'mt-8' : 'mt-0'
                }`}
              >
                <img
                  src={src}
                  alt={`Happy family with pet ${index + 1}`}
                  className="w-full h-48 md:h-64 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        
        {/* Additional Decorative Blurs */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full animate-fade-up opacity-0">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Over 5,000 successful adoptions
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-up opacity-0 stagger-1">
              Find Your{" "}
              <span className="text-gradient">Perfect</span>
              <br />
              Companion
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg font-body leading-relaxed animate-fade-up opacity-0 stagger-2">
              Every pet deserves a loving home. Browse hundreds of adorable pets waiting for their forever families and make a difference today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0 stagger-3">
              <Link to="/pets">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 group">
                  Browse Pets
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-foreground text-foreground hover:bg-foreground hover:text-background">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 animate-fade-up opacity-0 stagger-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 bg-muted rounded-3xl overflow-hidden animate-fade-up opacity-0 stagger-1">
                  <img
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop"
                    alt="Happy dog"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-64 bg-muted rounded-3xl overflow-hidden animate-fade-up opacity-0 stagger-2">
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop"
                    alt="Cute cat"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-64 bg-muted rounded-3xl overflow-hidden animate-fade-up opacity-0 stagger-3">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop"
                    alt="Dogs playing"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-48 bg-muted rounded-3xl overflow-hidden animate-fade-up opacity-0 stagger-4">
                  <img
                    src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop"
                    alt="Cat looking"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background shadow-medium rounded-2xl p-4 flex items-center gap-4 animate-float">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-primary/20"
                  />
                ))}
              </div>
              <div>
                <p className="font-semibold">Join 10k+ adopters</p>
                <p className="text-sm text-muted-foreground">Making pets happy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
