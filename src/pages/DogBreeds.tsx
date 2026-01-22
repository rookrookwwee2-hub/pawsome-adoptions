import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Dog } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { dogBreeds } from "@/data/breeds";
import { Card, CardContent } from "@/components/ui/card";

const DogBreeds = () => {
  return (
    <>
      <Helmet>
        <title>Dog Breeds Directory | Pawsfam</title>
        <meta
          name="description"
          content="Explore our directory of dog breeds. Find your perfect canine companion from popular breeds including Golden Retriever, French Bulldog, and more."
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
                  { label: "Dog Breeds" },
                ]}
              />
              <div className="text-center max-w-3xl mx-auto mt-8">
                <span className="text-primary font-medium tracking-wide uppercase text-sm">
                  Canine Companions
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
                  Dog Breeds Directory
                </h1>
                <p className="text-muted-foreground text-lg">
                  Find your loyal companion. Browse our selection of dog breeds, each with their own special traits and loving personalities.
                </p>
              </div>
            </div>
          </section>

          {/* Breeds Grid */}
          <section className="py-16">
            <div className="container-custom">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {dogBreeds.map((breed, index) => (
                  <Link
                    key={breed.slug}
                    to={`/pets?breed=${encodeURIComponent(breed.name)}&type=dog`}
                    className="group opacity-0 animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all group-hover:-translate-y-1">
                      <CardContent className="p-6 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                          <Dog className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">
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

export default DogBreeds;
