import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PetCard from "@/components/pets/PetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { mapDbPetToPetCard, type DbPet } from "@/lib/pets";

interface PetCategorySectionProps {
  title: string;
  subtitle: string;
  label: string;
  pets: DbPet[];
  isLoading: boolean;
  linkTo: string;
  linkLabel: string;
}

const PetCategorySection = ({
  title,
  subtitle,
  label,
  pets,
  isLoading,
  linkTo,
  linkLabel,
}: PetCategorySectionProps) => {
  if (!isLoading && pets.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <span className="text-primary font-medium tracking-wide uppercase text-sm">
              {label}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {title}
            </h2>
            <p className="text-muted-foreground max-w-lg">{subtitle}</p>
          </div>
          <Link
            to={linkTo}
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all group"
          >
            {linkLabel}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-soft">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            : pets.slice(0, 8).map((pet, index) => (
                <div
                  key={pet.id}
                  className="opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <PetCard pet={mapDbPetToPetCard(pet)} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default PetCategorySection;
