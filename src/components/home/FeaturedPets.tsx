import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PetCard from "@/components/pets/PetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { mapDbPetToPetCard, usePublicPets } from "@/lib/pets";

const FeaturedPets = () => {
  const { data: pets = [], isLoading } = usePublicPets({ limit: 4 });

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
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-soft">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))
            : pets.map((pet, index) => {
                const cardPet = mapDbPetToPetCard(pet);
                return (
                  <div
                    key={pet.id}
                    className="opacity-0 animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <PetCard pet={cardPet} />
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPets;
