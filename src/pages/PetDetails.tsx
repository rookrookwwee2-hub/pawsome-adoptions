import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet-async";
import {
  Calendar, Check, Heart, MapPin, Share2, Wallet, Shield, Syringe, Dna, FileCheck, Globe, Play, Scale, ShoppingCart,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AddOnsSelection from "@/components/cart/AddOnsSelection";
import TravelOptionsSelector from "@/components/pets/TravelOptionsSelector";
import { useCart, CartAddOn } from "@/contexts/CartContext";
import { formatPetStatusLabel, mapDbPetToPetDetails, usePublicPet } from "@/lib/pets";
import { useTranslation } from "react-i18next";

const PetDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: petRow, isLoading } = usePublicPet(id);
  const { addToCart, formatPrice } = useCart();

  const pet = useMemo(() => (petRow ? mapDbPetToPetDetails(petRow) : null), [petRow]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<CartAddOn[]>([]);
  const [travelSelection, setTravelSelection] = useState<{
    type: "ground" | "air"; country: string; countryLabel: string; price: number; flightNanny: boolean; flightNannyPrice: number;
  } | null>(null);
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  const flightNannyBasePrice = petRow?.flight_nanny_price || 500;
  const shippingPrice = travelSelection ? travelSelection.price + travelSelection.flightNannyPrice : 0;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const fullOrderTotal = (pet?.fee || 0) + shippingPrice + addOnsTotal;
  const reservationDeposit = Math.round(fullOrderTotal * 0.3);
  const remainingBalance = fullOrderTotal - reservationDeposit;
  const totalPrice = paymentType === "deposit" ? reservationDeposit : fullOrderTotal;

  const healthBadges = useMemo(() => {
    if (!petRow) return [];
    const badges = [];
    if (petRow.genetic_health_guarantee) badges.push({ label: t("petDetails.geneticHealth", { years: petRow.genetic_health_years || 1 }), icon: Shield, color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" });
    if (petRow.fiv_felv_negative) badges.push({ label: t("petDetails.fivFelv"), icon: Check, color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" });
    if (petRow.fvrcp_vaccine) badges.push({ label: t("petDetails.fvrcp"), icon: Syringe, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" });
    if (petRow.rabies_vaccine) badges.push({ label: t("petDetails.rabies"), icon: Syringe, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" });
    if (petRow.health_certificate) badges.push({ label: t("petDetails.healthCert"), icon: FileCheck, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400" });
    if (petRow.pet_passport) badges.push({ label: t("petDetails.petPassport"), icon: Globe, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400" });
    if (petRow.dewormed) badges.push({ label: t("petDetails.deworming"), icon: Check, color: "text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400" });
    if (petRow.microchipped) badges.push({ label: t("petDetails.microchipped"), icon: Dna, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" });
    return badges;
  }, [petRow, t]);

  useEffect(() => { setSelectedImage(0); }, [pet?.id]);

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t("petDetails.loadingPet")}</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4">{t("petDetails.petNotFound")}</h1>
          <p className="text-muted-foreground mb-8">{t("petDetails.petNotFoundDesc")}</p>
          <Link to="/pets"><Button className="rounded-full">{t("petDetails.browseAvailable")}</Button></Link>
        </div>
      </div>
    );
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      if (pricingSectionRef.current) {
        pricingSectionRef.current.classList.add("ring-2", "ring-primary", "ring-offset-2");
        setTimeout(() => { pricingSectionRef.current?.classList.remove("ring-2", "ring-primary", "ring-offset-2"); }, 2000);
      }
    }, 300);
  };

  const handleReserve = (shouldNavigate: boolean = true) => {
    addToCart({
      petId: pet.id, petName: pet.name, petImage: pet.images[0], basePrice: pet.fee, addOns: selectedAddOns,
      shippingMethod: travelSelection ? {
        id: `${travelSelection.type}_${travelSelection.country}`,
        name: `${travelSelection.type === "ground" ? "Ground Transport" : "Air Cargo"} to ${travelSelection.countryLabel}${travelSelection.flightNanny ? " + Flight Nanny" : ""}`,
        price: travelSelection.price + travelSelection.flightNannyPrice,
      } : undefined,
      isReservation: paymentType === "deposit",
      reservationDeposit: paymentType === "deposit" ? reservationDeposit : undefined,
    });
    toast.success(t("petDetails.addedToCart"), { description: t("petDetails.addedToCartDesc", { name: pet.name }) });
    if (!shouldNavigate) scrollToTop();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("petDetails.linkCopied"), { description: t("petDetails.linkCopiedDesc") });
  };

  const videoEmbedUrl = petRow?.video_url ? getVideoEmbedUrl(petRow.video_url) : null;
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
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Pawsfam" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={pet.images[0]} />
        <meta property="og:image:alt" content={`${pet.name} - ${pet.breed} available for adoption at Pawsfam`} />
        <meta property="og:url" content={pageUrl} />
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
            <div className="mb-6">
              <Breadcrumbs items={[{ label: t("nav.home"), href: "/" }, { label: t("nav.adopt"), href: "/pets" }, { label: pet.name }]} />
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <div className="space-y-4 animate-fade-up opacity-0">
                <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
                  <img src={pet.images[selectedImage]} alt={pet.name} className="w-full h-full object-cover" />
                </div>
                {pet.images.length > 1 && (
                  <div className="flex gap-3">
                    {pet.images.map((image, index) => (
                      <button key={index} onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded-xl overflow-hidden transition-all ${selectedImage === index ? "ring-2 ring-primary ring-offset-2" : "opacity-60 hover:opacity-100"}`}>
                        <img src={image} alt={`${pet.name} ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
                {videoEmbedUrl && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        {t("petDetails.watch", { name: pet.name })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe src={videoEmbedUrl} title={`Video of ${pet.name}`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Pet Info */}
              <div className="space-y-6 animate-fade-up opacity-0 stagger-1">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2">{formatPetStatusLabel(pet.status)}</span>
                      <h1 className="font-display text-4xl md:text-5xl font-bold">{pet.name}</h1>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => setIsFavorite(!isFavorite)}>
                        <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}><Share2 className="w-5 h-5" /></Button>
                    </div>
                  </div>
                  <p className="text-xl text-muted-foreground">{pet.breed}{pet.gender ? ` • ${pet.gender}` : ""}{pet.size ? ` • ${pet.size}` : ""}</p>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />{pet.age}</span>
                    {petRow?.weight && <span className="flex items-center gap-2"><Scale className="w-5 h-5 text-primary" />{petRow.weight} {t("petDetails.lbs")}</span>}
                    {pet.location && <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" />{pet.location}</span>}
                  </div>
                </div>

                {healthBadges.length > 0 && (
                  <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400"><Shield className="w-5 h-5" />{t("petDetails.healthCerts")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {healthBadges.map((badge, index) => (
                          <Badge key={index} variant="secondary" className={`flex items-center gap-1.5 py-1.5 px-3 ${badge.color}`}>
                            <badge.icon className="w-3.5 h-3.5" />{badge.label}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {pet.description && (
                  <div className="space-y-3">
                    <h2 className="font-display text-xl font-semibold">{t("petDetails.about", { name: pet.name })}</h2>
                    <p className="text-muted-foreground leading-relaxed">{pet.description}</p>
                  </div>
                )}

                <TravelOptionsSelector onSelectionChange={setTravelSelection} flightNannyBasePrice={flightNannyBasePrice} petLocation={pet.location || "California, USA"} petLocationCountry={(petRow as any)?.location_country} petLocationRegion={(petRow as any)?.location_region} />

                {pet && <AddOnsSelection petId={pet.id} onUpdate={(addOns) => setSelectedAddOns(addOns)} />}

                {/* Pricing Summary */}
                <Card ref={pricingSectionRef} className="transition-all duration-300">
                  <CardHeader className="pb-2"><CardTitle className="text-lg">{t("petDetails.pricingSummary")}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button variant={paymentType === "full" ? "default" : "outline"} size="sm" onClick={() => { setPaymentType("full"); scrollToTop(); }} className="flex-1">{t("petDetails.fullPayment")}</Button>
                      <Button variant={paymentType === "deposit" ? "default" : "outline"} size="sm" onClick={() => { setPaymentType("deposit"); scrollToTop(); }} className="flex-1">{t("petDetails.deposit30")}</Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">{t("petDetails.adoptionFee")}</span><span>{formatPrice(pet.fee)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t("petDetails.shipping")} {travelSelection ? `(${travelSelection.countryLabel})` : ""}</span><span>{formatPrice(shippingPrice)}</span></div>
                      {addOnsTotal > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{t("petDetails.addOns")}</span><span>{formatPrice(addOnsTotal)}</span></div>}
                      <div className="flex justify-between pt-2 border-t font-medium"><span>{t("petDetails.total")}</span><span>{formatPrice(fullOrderTotal)}</span></div>
                      {paymentType === "deposit" && (
                        <>
                          <div className="flex justify-between text-primary font-semibold"><span>{t("petDetails.reservationDeposit")}</span><span>{formatPrice(reservationDeposit)}</span></div>
                          <div className="flex justify-between text-muted-foreground"><span>{t("petDetails.remainingBalance")}</span><span>{formatPrice(remainingBalance)}</span></div>
                        </>
                      )}
                      <div className="flex justify-between pt-2 border-t font-semibold text-base"><span>{t("petDetails.totalDue")}</span><span className="text-primary">{formatPrice(totalPrice)}</span></div>
                    </div>
                    {!travelSelection && <p className="text-sm text-destructive font-medium text-center">⚠ Please select a travel option above before proceeding</p>}
                    <div className="space-y-2 pt-2">
                      <Button size="lg" variant="secondary" className="w-full rounded-full gap-2" onClick={() => handleReserve(false)} disabled={!travelSelection}><ShoppingCart className="w-4 h-4" />{t("petDetails.addToCart")}</Button>
                      <Button size="lg" className="w-full rounded-full" disabled={!travelSelection} onClick={() => { handleReserve(true); navigate("/checkout"); }}>{paymentType === "deposit" ? t("petDetails.reserveNow") : t("petDetails.addToCart")}</Button>
                      <Button variant="outline" size="lg" className="w-full rounded-full gap-2" disabled={!travelSelection} onClick={() => { handleReserve(true); navigate("/checkout"); }}><Wallet className="w-4 h-4" />{t("checkout.continueToPayment")}</Button>
                    </div>
                  </CardContent>
                </Card>

                {pet.goodWith.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-display text-lg font-semibold">Good With</h3>
                    <ul className="space-y-2">
                      {pet.goodWith.map((item) => (
                        <li key={item} className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" />{item}</li>
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
