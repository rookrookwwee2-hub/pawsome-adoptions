import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronLeft, ChevronRight, Cat, Dog } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

interface Review {
  id: string;
  customer_name: string;
  country: string;
  country_flag: string | null;
  pet_type: string;
  review_text: string;
  photo_url: string | null;
}

const CustomerLoveSlider = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["homepage-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "approved")
        .in("display_location", ["homepage", "both"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-foreground text-background">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-pulse h-8 w-48 bg-background/20 rounded mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-medium tracking-wide uppercase text-sm">
            Success Stories
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Customer Love 💕
          </h2>
          <p className="text-background/70">
            Hear from families who found their perfect companions through PawHaven.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {reviews.map((review, index) => (
              <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div
                  className="relative bg-background/5 backdrop-blur-sm rounded-2xl p-8 h-full opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Quote Icon */}
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/30" />

                  {/* Pet Type Icon */}
                  <div className="flex items-center gap-2 mb-4">
                    {review.pet_type === "cat" ? (
                      <Cat className="w-5 h-5 text-primary" />
                    ) : (
                      <Dog className="w-5 h-5 text-primary" />
                    )}
                    <span className="text-sm text-background/60 capitalize">
                      {review.pet_type} Parent
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-background/80 mb-6 leading-relaxed line-clamp-4">
                    "{review.review_text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    {review.photo_url ? (
                      <img
                        src={review.photo_url}
                        alt={review.customer_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {review.customer_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{review.customer_name}</p>
                      <p className="text-sm text-background/60">
                        {review.country} {review.country_flag}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-background text-foreground hover:bg-background/90" />
          <CarouselNext className="hidden md:flex -right-4 bg-background text-foreground hover:bg-background/90" />
        </Carousel>

        {/* See All Reviews Button */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-[#0fa185] text-white hover:bg-[#0d8a72] border-0">
            <Link to="/reviews">See All Reviews →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CustomerLoveSlider;
