import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Star, Cat, Dog, Quote } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  customer_name: string;
  country: string;
  country_flag: string | null;
  pet_type: string;
  review_text: string;
  photo_url: string | null;
  created_at: string;
}

const Reviews = () => {
  const [filter, setFilter] = useState<"all" | "cat" | "dog">("all");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "approved")
        .in("display_location", ["reviews_page", "both"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.pet_type === filter;
  });

  return (
    <>
      <Helmet>
        <title>Customer Reviews - Pawsfam</title>
        <meta
          name="description"
          content="Read reviews from happy pet parents who found their perfect companions through Pawsfam. Real stories from real families."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
            <div className="container-custom text-center">
              <span className="text-primary font-medium tracking-wide uppercase text-sm">
                Testimonials
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
                Customer Reviews
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Real stories from families who found their perfect companions through Pawsfam.
                Every review is from a verified adoption.
              </p>
            </div>
          </section>

          {/* Filter Buttons */}
          <section className="py-8 border-b">
            <div className="container-custom">
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className="gap-2"
                >
                  All Reviews ({reviews.length})
                </Button>
                <Button
                  variant={filter === "dog" ? "default" : "outline"}
                  onClick={() => setFilter("dog")}
                  className="gap-2"
                >
                  <Dog className="w-4 h-4" />
                  Dog Parents ({reviews.filter((r) => r.pet_type === "dog").length})
                </Button>
                <Button
                  variant={filter === "cat" ? "default" : "outline"}
                  onClick={() => setFilter("cat")}
                  className="gap-2"
                >
                  <Cat className="w-4 h-4" />
                  Cat Parents ({reviews.filter((r) => r.pet_type === "cat").length})
                </Button>
              </div>
            </div>
          </section>

          {/* Reviews Grid */}
          <section className="py-16">
            <div className="container-custom">
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-muted rounded-2xl h-64" />
                  ))}
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No reviews found.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredReviews.map((review, index) => (
                    <div
                      key={review.id}
                      className="relative bg-card border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow opacity-0 animate-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Quote Icon */}
                      <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />

                      {/* Photo */}
                      {review.photo_url && (
                        <div className="mb-6 -mx-8 -mt-8">
                          <img
                            src={review.photo_url}
                            alt={`${review.customer_name}'s pet`}
                            className="w-full h-48 object-cover rounded-t-2xl"
                          />
                        </div>
                      )}

                      {/* Pet Type */}
                      <div className="flex items-center gap-2 mb-4">
                        {review.pet_type === "cat" ? (
                          <Cat className="w-5 h-5 text-primary" />
                        ) : (
                          <Dog className="w-5 h-5 text-primary" />
                        )}
                        <span className="text-sm text-muted-foreground capitalize">
                          {review.pet_type} Parent
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-foreground/80 mb-6 leading-relaxed">
                        "{review.review_text}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {review.customer_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {review.customer_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {review.country} {review.country_flag}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Reviews;
