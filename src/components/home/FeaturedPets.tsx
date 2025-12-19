import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PetCard from "@/components/pets/PetCard";

const featuredPets = [
  {
    id: "1",
    name: "Luna",
    type: "Dog",
    breed: "Golden Retriever",
    age: "2 years",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop",
    fee: 250,
  },
  {
    id: "2",
    name: "Whiskers",
    type: "Cat",
    breed: "British Shorthair",
    age: "1 year",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop",
    fee: 150,
  },
  {
    id: "3",
    name: "Max",
    type: "Dog",
    breed: "German Shepherd",
    age: "3 years",
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&h=600&fit=crop",
    fee: 300,
  },
  {
    id: "4",
    name: "Milo",
    type: "Cat",
    breed: "Maine Coon",
    age: "6 months",
    location: "Houston, TX",
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=600&fit=crop",
    fee: 200,
  },
];

const FeaturedPets = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <span className="text-primary font-medium tracking-wide uppercase text-sm">
              Featured Friends
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Pets Waiting for You
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Meet some of our adorable pets who are ready to become part of your family.
            </p>
          </div>
          <Link
            to="/pets"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all group"
          >
            View All Pets
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Pet Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPets.map((pet, index) => (
            <div
              key={pet.id}
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PetCard pet={pet} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPets;
