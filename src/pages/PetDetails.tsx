import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet-async";
import {
  Calendar,
  Check,
  Heart,
  MapPin,
  Share2,
  Wallet,
  Shield,
  Syringe,
  Dna,
  FileCheck,
  Globe,
  Play,
  Scale,
  ShoppingCart,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import AddOnsSelection from "@/components/cart/AddOnsSelection";
import GroundTransportSelector from "@/components/pets/GroundTransportSelector";
import { useCart, CartAddOn } from "@/contexts/CartContext";
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
  const { addToCart, formatPrice } = useCart();

  const pet = useMemo(() => (petRow ? mapDbPetToPetDetails(petRow) : null), [petRow]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<CartAddOn[]>([]);
  const [groundTransportSelection, setGroundTransportSelection] = useState<{
    distanceKm: number;
    distanceMiles: number;
    estimatedTime: string;
    transportType: "standard" | "private";
    transportTypeName: string;
    hasCompanion: boolean;
    baseShippingPrice: number;
    companionFee: number;
    totalPrice: number;
  } | null>(null);
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");
  
  // Ref for auto-scrolling to pricing section
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  // Calculate shipping price from ground transport selection
  const shippingPrice = groundTransportSelection?.totalPrice || 0;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const reservationDeposit = pet ? Math.round(pet.fee * 0.3) : 0; // 30% deposit
  const baseAmount = paymentType === "deposit" ? reservationDeposit : (pet?.fee || 0);
  const totalPrice = baseAmount + shippingPrice + addOnsTotal;

  // Health badges from database
  const healthBadges = useMemo(() => {
    if (!petRow) return [];
    const badges = [];
    
    if (petRow.genetic_health_guarantee) {
      badges.push({ 
        label: `${petRow.genetic_health_years || 1} Year Genetic Health Guarantee`, 
        icon: Shield,
        color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
      });
    }
    if (petRow.fiv_felv_negative) {
      badges.push({ 
        label: "FIV/FeLV Negative", 
        icon: Check,
        color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
      });
    }
    if (petRow.fvrcp_vaccine) {
      badges.push({ 
        label: "FVRCP Vaccines", 
        icon: Syringe,
        color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
      });
    }
    if (petRow.rabies_vaccine) {
      badges.push({ 
        label: "Rabies Shot", 
        icon: Syringe,
        color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
      });
    }
    if (petRow.health_certificate) {
      badges.push({ 
        label: "Veterinary Health Certificate", 
        icon: FileCheck,
        color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400"
      });
    }
    if (petRow.pet_passport) {
      badges.push({ 
        label: "Pet Passport", 
        icon: Globe,
        color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400"
      });
    }
    if (petRow.dewormed) {
      badges.push({ 
        label: "Deworming Complete", 
        icon: Check,
        color: "text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400"
      });
    }
    if (petRow.microchipped) {
      badges.push({ 
        label: "Microchipped", 
        icon: Dna,
        color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400"
      });
    }
    
    return badges;
  }, [petRow]);

  useEffect(() => {
    setSelectedImage(0);
  }, [pet?.id]);

  // Extract video ID for embedding
  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url;
  };

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Add highlight effect to pricing section after scroll completes
    setTimeout(() => {
      if (pricingSectionRef.current) {
        pricingSectionRef.current.classList.add("ring-2", "ring-primary", "ring-offset-2");
        setTimeout(() => {
          pricingSectionRef.current?.classList.remove("ring-2", "ring-primary", "ring-offset-2");
        }, 2000);
      }
    }, 300);
  };

  const handleReserve = (shouldNavigate: boolean = true) => {
    // Add to cart (no login required - guests can checkout)
    addToCart({
      petId: pet.id,
      petName: pet.name,
      petImage: pet.images[0],
      basePrice: pet.fee,
      addOns: selectedAddOns,
      shippingMethod: groundTransportSelection ? {
        id: `ground_${groundTransportSelection.transportType}`,
        name: `${groundTransportSelection.transportTypeName}${groundTransportSelection.hasCompanion ? " + Companion" : ""}`,
        price: groundTransportSelection.totalPrice,
      } : undefined,
      isReservation: paymentType === "deposit",
      reservationDeposit: reservationDeposit,
    });

    toast.success("Added to cart!", {
      description: `${pet.name} has been added to your cart.`,
    });

    // Scroll to top if not navigating
    if (!shouldNavigate) {
      scrollToTop();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!", {
      description: "Share this pet with friends and family.",
    });
  };

  const videoEmbedUrl = petRow?.video_url ? getVideoEmbedUrl(petRow.video_url) : null;

  // Generate clean description for meta tags
  const metaDescription = pet.description 
    ? `Meet ${pet.name}, a ${pet.age} old ${pet.breed}. ${pet.description.replace(/[^\w\s.,!?-]/g, '').slice(0, 140)}...`
    : `Adopt ${pet.name}, a lovely ${pet.age} old ${pet.breed} looking for a forever home.`;

  const pageUrl = `${window.location.origin}/pets/${pet.id}`;
  const ogTitle = `${pet.name} – ${pet.breed} ${pet.type} for Adoption | Pawsfam`;

  return (
    <>
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={metaDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Pawsfam" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={pet.images[0]} />
        <meta property="og:image:alt" content={`${pet.name} - ${pet.breed} available for adoption at Pawsfam`} />
        <meta property="og:url" content={pageUrl} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@pawsfam" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={pet.images[0]} />
        
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-16">
          <div className="container-custom">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Pets", href: "/pets" },
                  { label: pet.name },
                ]}
              />
            </div>

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

                {/* Video Player */}
                {videoEmbedUrl && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        Watch {pet.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe
                          src={videoEmbedUrl}
                          title={`Video of ${pet.name}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Pet Info */}
              <div className="space-y-6 animate-fade-up opacity-0 stagger-1">
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
                    {petRow?.weight && (
                      <span className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-primary" />
                        {petRow.weight} lbs
                      </span>
                    )}
                    {pet.location ? (
                      <span className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {pet.location}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Health Badges */}
                {healthBadges.length > 0 && (
                  <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Shield className="w-5 h-5" />
                        Health & Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {healthBadges.map((badge, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className={`flex items-center gap-1.5 py-1.5 px-3 ${badge.color}`}
                          >
                            <badge.icon className="w-3.5 h-3.5" />
                            {badge.label}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* About */}
                {pet.description ? (
                  <div className="space-y-3">
                    <h2 className="font-display text-xl font-semibold">
                      About {pet.name}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {pet.description}
                    </p>
                  </div>
                ) : null}

                {/* Travel Options */}
                <GroundTransportSelector
                  petLocation={pet.location || "California, USA"}
                  onSelectionChange={setGroundTransportSelection}
                />

                {/* Add-Ons */}
                {pet && (
                  <AddOnsSelection 
                    petId={pet.id} 
                    onUpdate={(addOns) => setSelectedAddOns(addOns)}
                  />
                )}

                {/* Pricing Summary */}
                <Card ref={pricingSectionRef} className="transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pricing Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Payment Type Selection */}
                    <div className="flex gap-2">
                      <Button
                        variant={paymentType === "full" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setPaymentType("full");
                          scrollToTop();
                        }}
                        className="flex-1"
                      >
                        Full Payment
                      </Button>
                      <Button
                        variant={paymentType === "deposit" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setPaymentType("deposit");
                          scrollToTop();
                        }}
                        className="flex-1"
                      >
                        Reserve (30%)
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {paymentType === "deposit" ? "Reservation Deposit" : "Adoption Fee"}
                        </span>
                        <span>{formatPrice(baseAmount)}</span>
                      </div>
                      {paymentType === "deposit" && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Remaining Balance (due later)</span>
                          <span>{formatPrice(pet.fee - reservationDeposit)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Shipping {groundTransportSelection ? `(${groundTransportSelection.transportTypeName})` : ""}
                        </span>
                        <span>{formatPrice(shippingPrice)}</span>
                      </div>
                      {addOnsTotal > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Add-ons</span>
                          <span>{formatPrice(addOnsTotal)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t font-semibold text-base">
                        <span>Total Due Now</span>
                        <span className="text-primary">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      {/* Add to Cart button - scrolls to pricing */}
                      <Button
                        size="lg"
                        variant="secondary"
                        className="w-full rounded-full gap-2"
                        onClick={() => handleReserve(false)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>
                      <Button
                        size="lg"
                        className="w-full rounded-full"
                        onClick={() => {
                          handleReserve(true);
                          navigate("/checkout");
                        }}
                      >
                        {paymentType === "deposit" ? "Reserve Now" : "Adopt Now"}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full rounded-full gap-2"
                        onClick={() => {
                          handleReserve(true);
                          navigate("/checkout");
                        }}
                      >
                        <Wallet className="w-4 h-4" />
                        Proceed to Checkout
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Good With */}
                {pet.goodWith.length > 0 && (
                  <div className="space-y-3">
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
                )}
              </div>
            </div>
          </div>
        </main>


        <Footer />
      </div>
    </>
  );
};

export default PetDetails;
