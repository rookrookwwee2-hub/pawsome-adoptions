import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const stats = [
    { icon: Heart, value: "5,000+", label: "Pets Adopted" },
    { icon: Shield, value: "100%", label: "Verified Shelters" },
    { icon: Clock, value: "24/7", label: "Support" },
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1544568100-847a948585b9?w=1920&h=1080&fit=crop",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Ken Burns Animated Background Slideshow */}
      <div className="absolute inset-0 -z-10">
        {heroImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={src}
              alt={`Pet slideshow ${index + 1}`}
              className={`w-full h-full object-cover ${index === currentSlide ? "animate-ken-burns" : ""}`}
              loading={index === currentSlide ? "eager" : "lazy"}
              fetchPriority={index === currentSlide ? "high" : "auto"}
              decoding="async"
            />
          </div>
        ))}
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/45 via-foreground/15 to-background/80 dark:from-background/45 dark:via-background/20 dark:to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/55 via-foreground/10 to-transparent dark:from-background/60 dark:via-background/25 dark:to-transparent" />
      </div>

      <div className="container-custom pt-20">
        <div className="max-w-2xl">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 backdrop-blur-sm rounded-full animate-fade-up opacity-0">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground dark:text-foreground">
                Over 5,000 successful adoptions
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-up opacity-0 stagger-1 text-primary-foreground dark:text-foreground drop-shadow-lg">
              Find Your{" "}
              <span className="text-primary">Perfect</span>
              <br />
              Companion
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 dark:text-foreground/90 max-w-lg font-body leading-relaxed animate-fade-up opacity-0 stagger-2 drop-shadow-md">
              Every pet deserves a loving home. Browse hundreds of adorable pets waiting for their forever families and make a difference today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0 stagger-3">
              <Link to="/pets">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-background text-foreground hover:bg-background/90 group shadow-lg">
                  Browse Pets
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full border-primary-foreground/50 text-primary-foreground hover:bg-background/10 backdrop-blur-sm dark:border-foreground/40 dark:text-foreground"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-6 animate-fade-up opacity-0 stagger-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground dark:text-foreground" />
                  </div>
                  <div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-primary-foreground dark:text-foreground drop-shadow-md">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-primary-foreground/80 dark:text-foreground/80">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary w-6' 
                : 'bg-primary-foreground/50 hover:bg-primary-foreground/70 dark:bg-foreground/40 dark:hover:bg-foreground/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
