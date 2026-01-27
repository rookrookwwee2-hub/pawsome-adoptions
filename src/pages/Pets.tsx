import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Filter, Search, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PetCard from "@/components/pets/PetCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mapDbPetToPetCard, usePublicPets } from "@/lib/pets";

const petTypes = ["All", "Dog", "Cat", "Bird", "Other"];
const sizes = ["All", "Small", "Medium", "Large"];

const Pets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const { data: pets = [], isLoading } = usePublicPets();

  const filteredPets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return pets.filter((pet) => {
      const name = (pet.name ?? "").toLowerCase();
      const breed = (pet.breed ?? "").toLowerCase();
      const location = (pet.location ?? "").toLowerCase();

      const matchesSearch =
        !query || name.includes(query) || breed.includes(query) || location.includes(query);

      const matchesType = selectedType === "All" || pet.type === selectedType;
      const matchesSize = selectedSize === "All" || (pet.size ?? "") === selectedSize;

      return matchesSearch && matchesType && matchesSize;
    });
  }, [pets, searchQuery, selectedType, selectedSize]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setSelectedSize("All");
  };

  const hasActiveFilters =
    searchQuery || selectedType !== "All" || selectedSize !== "All";

  return (
    <>
      <Helmet>
        <title>Available Pets for Adoption | Pawsfam</title>
        <meta
          name="description"
          content="Browse our available dogs, cats, and other pets for adoption. Find your perfect companion and give them a forever home."
        />
        <meta property="og:title" content="Available Pets for Adoption | Pawsfam" />
        <meta property="og:description" content="Browse our available dogs, cats, and other pets for adoption. Find your perfect companion." />
        <meta property="og:image" content="/og-pets.png" />
        <meta name="twitter:title" content="Available Pets for Adoption | Pawsfam" />
        <meta name="twitter:image" content="/og-pets.png" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-16">
          <div className="container-custom">
            {/* Header */}
            <div className="mb-12 space-y-4">
              <h1 className="font-display text-4xl md:text-5xl font-bold animate-fade-up opacity-0">
                Find Your New <span className="text-gradient">Best Friend</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl animate-fade-up opacity-0 stagger-1">
                Browse our available pets and find your perfect match. Every pet
                deserves a loving home.
              </p>
            </div>

            {/* Search & Filters */}
            <div className="mb-8 space-y-4 animate-fade-up opacity-0 stagger-2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name, breed, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 rounded-full border-border focus:border-primary"
                  />
                </div>

                {/* Filter Toggle (Mobile) */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden rounded-full h-12"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>

                {/* Type Filter (Desktop) */}
                <div className="hidden md:flex gap-2">
                  {petTypes.map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      onClick={() => setSelectedType(type)}
                      className="rounded-full"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="md:hidden p-4 bg-muted rounded-2xl space-y-4 animate-scale-in">
                  <div>
                    <p className="text-sm font-medium mb-2">Pet Type</p>
                    <div className="flex flex-wrap gap-2">
                      {petTypes.map((type) => (
                        <Button
                          key={type}
                          variant={selectedType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedType(type)}
                          className="rounded-full"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSize(size)}
                          className="rounded-full"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Active Filters & Clear */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {filteredPets.length} pets found
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-primary hover:text-primary/80"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear filters
                  </Button>
                </div>
              )}
            </div>

            {/* Pet Grid */}
            {isLoading ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">Loading pets…</p>
              </div>
            ) : filteredPets.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPets.map((pet, index) => (
                  <div
                    key={pet.id}
                    className="opacity-0 animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <PetCard pet={mapDbPetToPetCard(pet)} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">
                  No pets found matching your criteria
                </p>
                <Button onClick={clearFilters} className="rounded-full">
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Pets;
