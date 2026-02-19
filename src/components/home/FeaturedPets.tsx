import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PetCard from "@/components/pets/PetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { mapDbPetToPetCard, usePublicPets } from "@/lib/pets";
import PetCategorySection from "./PetCategorySection";
import { useTranslation } from "react-i18next";

const FeaturedPets = () => {
  const { data: pets = [], isLoading } = usePublicPets();
  const { t } = useTranslation();

  const dogs = useMemo(() => pets.filter((p) => p.type === "Dog"), [pets]);
  const cats = useMemo(() => pets.filter((p) => p.type === "Cat"), [pets]);
  const newArrivals = useMemo(() => [...pets].slice(0, 8), [pets]);
  const featuredPets = useMemo(() => pets.slice(0, 20), [pets]);

  return (
    <>
      {/* All Featured Pets */}
      <section className="py-24 bg-muted/30">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <span className="text-primary font-medium tracking-wide uppercase text-sm">
                {t("featured.label")}
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                {t("featured.title")}
              </h2>
              <p className="text-muted-foreground max-w-lg">
                {t("featured.description")}
              </p>
            </div>
            <Link
              to="/pets"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all group"
            >
              {t("featured.viewAllPets")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
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
              : featuredPets.map((pet, index) => {
                  const cardPet = mapDbPetToPetCard(pet);
                  return (
                    <div
                      key={pet.id}
                      className="opacity-0 animate-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <PetCard pet={cardPet} />
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <PetCategorySection
        label={t("featured.justAdded")}
        title={t("featured.newArrivals")}
        subtitle={t("featured.newArrivalsDesc")}
        pets={newArrivals}
        isLoading={isLoading}
        linkTo="/pets"
        linkLabel={t("featured.seeAllNewPets")}
      />

      {/* Dogs Section */}
      <section className="bg-muted/30">
        <PetCategorySection
          label={t("featured.dogsLabel")}
          title={t("featured.dogsTitle")}
          subtitle={t("featured.dogsDesc")}
          pets={dogs}
          isLoading={isLoading}
          linkTo="/pets?type=Dog"
          linkLabel={t("featured.viewAllDogs")}
        />
      </section>

      {/* Cats Section */}
      <PetCategorySection
        label={t("featured.catsLabel")}
        title={t("featured.catsTitle")}
        subtitle={t("featured.catsDesc")}
        pets={cats}
        isLoading={isLoading}
        linkTo="/pets?type=Cat"
        linkLabel={t("featured.viewAllCats")}
      />
    </>
  );
};

export default FeaturedPets;
