import { useEffect, useRef, useState, useCallback } from "react";

interface PetImageSectionProps {
  variant?: "single" | "dual" | "triple";
  className?: string;
}

// Collection of high-quality pet images
const petImages = [
  {
    src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    alt: "Happy golden retriever with soft natural lighting",
    type: "dog",
  },
  {
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
    alt: "Adorable orange tabby cat looking at camera",
    type: "cat",
  },
  {
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
    alt: "Two friendly dogs playing together",
    type: "dog",
  },
  {
    src: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80",
    alt: "Cute gray cat with green eyes",
    type: "cat",
  },
  {
    src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80",
    alt: "Playful dalmatian puppy",
    type: "dog",
  },
  {
    src: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&q=80",
    alt: "Beautiful white cat with blue eyes",
    type: "cat",
  },
  {
    src: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80",
    alt: "Cute labrador puppy sitting",
    type: "dog",
  },
  {
    src: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800&q=80",
    alt: "Fluffy persian cat relaxing",
    type: "cat",
  },
  {
    src: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80",
    alt: "Happy dog running in meadow",
    type: "dog",
  },
  {
    src: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=80",
    alt: "Playful kitten with big eyes",
    type: "cat",
  },
];

// Get consistent images for each page based on a seed
const getImagesForVariant = (variant: string, seed: number) => {
  const shuffled = [...petImages].sort(() => 0.5 - Math.sin(seed));
  switch (variant) {
    case "single":
      return [shuffled[0]];
    case "dual":
      return [shuffled[0], shuffled[1]];
    case "triple":
      return [shuffled[0], shuffled[1], shuffled[2]];
    default:
      return [shuffled[0]];
  }
};

const PetImageSection = ({ variant = "single", className = "" }: PetImageSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [seed] = useState(() => Math.random() * 1000);
  const images = getImagesForVariant(variant, seed);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    
    // Calculate offset based on element position relative to viewport center
    const offset = (viewportCenter - elementCenter) * 0.15;
    setParallaxOffset(Math.max(-30, Math.min(30, offset)));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Add scroll listener for parallax
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const getGridClass = () => {
    switch (variant) {
      case "dual":
        return "grid-cols-1 sm:grid-cols-2";
      case "triple":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1 max-w-2xl mx-auto";
    }
  };

  return (
    <section ref={sectionRef} className={`py-12 overflow-hidden ${className}`}>
      <div className="container-custom">
        <div className={`grid ${getGridClass()} gap-6`}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`
                relative overflow-hidden rounded-2xl shadow-soft
                transition-all duration-700 ease-out
                ${isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
                }
              `}
              style={{ 
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                  style={{ 
                    transform: `translateY(${parallaxOffset * (index % 2 === 0 ? 1 : -0.7)}px) scale(1.1)`,
                    transition: "transform 0.1s ease-out"
                  }}
                />
              </div>
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetImageSection;
