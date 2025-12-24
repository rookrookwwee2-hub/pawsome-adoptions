import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Calendar,
  Check,
  Heart,
  MapPin,
  Share2,
  Wallet,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GuestCheckout from "@/components/checkout/GuestCheckout";
import DeliveryInfo from "@/components/pets/DeliveryInfo";
import {
  formatPetStatusLabel,
  mapDbPetToPetDetails,
  usePublicPet,
} from "@/lib/pets";

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: petRow, isLoading } = usePublicPet(id);

  const pet = useMemo(() => (petRow ? mapDbPetToPetDetails(petRow) : null), [petRow]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGuestCheckout, setShowGuestCheckout] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
  }, [pet?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading pet…</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Pet Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the pet you're looking for.
          </p>
          <Link to="/pets">
            <Button className="rounded-full">Browse Available Pets</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAdopt = () => {
    if (!user) {
      // Redirect to auth page with return URL
      navigate(`/auth?redirect=/pets/${id}`);
      toast.info("Please log in to start adoption", {
        description: "Create an account or sign in to continue.",
      });
      return;
    }
    // TODO: Implement adoption form for logged-in users
    toast.success("Application started!", {
      description: "You'll be redirected to the adoption form.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!", {
      description: "Share this pet with friends and family.",
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Adopt ${pet.name} - ${pet.breed} | PawHaven`}</title>
        <meta
          name="description"
          content={`Meet ${pet.name}, a ${pet.age} old ${pet.breed}. ${pet.description.slice(0, 150)}...`}
        />
        <meta property="og:title" content={`Adopt ${pet.name} | PawHaven`} />
        <meta property="og:image" content={pet.images[0]} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-16">
          <div className="container-custom">
            {/* Back Button */}
            <Link
              to="/pets"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to all pets
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <div className="space-y-4 animate-fade-up opacity-0">
                {/* Main Image */}
                <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
                  <img
                    src={pet.images[selectedImage]}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnails */}
                {pet.images.length > 1 && (
                  <div className="flex gap-3">
                    {pet.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded-xl overflow-hidden transition-all ${
                          selectedImage === index
                            ? "ring-2 ring-primary ring-offset-2"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${pet.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pet Info */}
              <div className="space-y-8 animate-fade-up opacity-0 stagger-1">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2">
                        {formatPetStatusLabel(pet.status)}
                      </span>
                      <h1 className="font-display text-4xl md:text-5xl font-bold">
                        {pet.name}
                      </h1>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorite ? "fill-primary text-primary" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={handleShare}
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-xl text-muted-foreground">
                    {pet.breed}
                    {pet.gender ? ` • ${pet.gender}` : ""}
                    {pet.size ? ` • ${pet.size}` : ""}
                  </p>

                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      {pet.age}
                    </span>
                    {pet.location ? (
                      <span className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {pet.location}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Adoption Fee */}
                <div className="p-6 bg-muted rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Adoption Fee</p>
                      <p className="font-display text-3xl font-bold text-primary">
                        ${pet.fee}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleAdopt}
                    >
                      Start Adoption
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full rounded-full gap-2"
                      onClick={() => setShowGuestCheckout(true)}
                    >
                      <Wallet className="w-4 h-4" />
                      Pay via Bank Transfer
                    </Button>
                  </div>
                </div>

                {/* About */}
                {pet.description ? (
                  <div className="space-y-4">
                    <h2 className="font-display text-2xl font-semibold">
                      About {pet.name}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {pet.description}
                    </p>
                  </div>
                ) : null}

                {/* Personality (optional) */}
                {pet.personality.length > 0 ? (
                  <div className="space-y-4">
                    <h2 className="font-display text-2xl font-semibold">
                      Personality
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {pet.personality.map((trait) => (
                        <span
                          key={trait}
                          className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Health & Good With */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-display text-lg font-semibold">Health</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        {pet.vaccinated ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <X className="w-5 h-5 text-destructive" />
                        )}
                        Vaccinated
                      </li>
                      <li className="flex items-center gap-2">
                        {pet.neutered ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <X className="w-5 h-5 text-destructive" />
                        )}
                        Spayed/Neutered
                      </li>
                    </ul>
                  </div>

                  {pet.goodWith.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-display text-lg font-semibold">
                        Good With
                      </h3>
                      <ul className="space-y-2">
                        {pet.goodWith.map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                {/* Delivery & Pickup Information */}
                <DeliveryInfo
                  deliveryType={petRow?.delivery_type}
                  deliveryNotes={petRow?.delivery_notes}
                  location={pet.location}
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />

        <GuestCheckout
          open={showGuestCheckout}
          onOpenChange={setShowGuestCheckout}
          petId={pet.id}
          petName={pet.name}
          amount={pet.fee}
        />
      </div>
    </>
  );
};

export default PetDetails;
