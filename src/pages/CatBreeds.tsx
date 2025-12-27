import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Cat } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { catBreeds } from "@/data/breeds";
import { Card, CardContent } from "@/components/ui/card";

const CatBreeds = () => {
  return (
    <>
      <Helmet>
        <title>Cat Breeds Directory | PawHaven</title>
        <meta
          name="description"
          content="Explore our complete directory of cat breeds. Find your perfect feline companion from over 50 breeds including Maine Coon, Persian, Bengal, and more."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          {/* Hero Section */}
          <section className="pt-24 pb-12 bg-gradient-to-b from-accent/50 to-background">
            <div className="container-custom">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Cat Breeds" },
                ]}
              />
              <div className="text-center max-w-3xl mx-auto mt-8">
                <span className="text-primary font-medium tracking-wide uppercase text-sm">
                  Feline Friends
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
                  Cat Breeds Directory
                </h1>
                <p className="text-muted-foreground text-lg">
                  Discover the perfect feline companion. Browse our extensive collection of cat breeds, each with unique personalities and characteristics.
                </p>
              </div>
            </div>
          </section>

          {/* Breeds Grid */}
          <section className="py-16">
            <div className="container-custom">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {catBreeds.map((breed, index) => (
                  <Link
                    key={breed.slug}
                    to={`/pets?breed=${encodeURIComponent(breed.name)}&type=cat`}
                    className="group opacity-0 animate-fade-up"
                    style={{ animationDelay: `${Math.min(index * 0.03, 0.5)}s` }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all group-hover:-translate-y-1">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                          <Cat className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                          {breed.name}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CatBreeds;
