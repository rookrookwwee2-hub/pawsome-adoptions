import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Dog Mom",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "Adopting Luna was the best decision we ever made. The process was so smooth and the team was incredibly supportive throughout.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Cat Dad",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "PawHaven made finding our perfect cat so easy. Whiskers has brought so much joy to our home. Highly recommend!",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Pet Parent",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    content: "The dedication of the PawHaven team is remarkable. They truly care about matching pets with the right families.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-medium tracking-wide uppercase text-sm">
            Success Stories
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Happy Families
          </h2>
          <p className="text-background/70">
            Hear from families who found their perfect companions through PawHaven.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-background/5 backdrop-blur-sm rounded-2xl p-8 opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/30" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-background/80 mb-8 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-background/60">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
