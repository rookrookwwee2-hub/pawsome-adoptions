import { useState, useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plane,
  UserCheck,
  MapPin,
  Clock,
  Route,
  DollarSign,
} from "lucide-react";
import {
  worldCountries,
  calculateDistance,
  kmToMiles,
  estimateFlightTime,
  calculateAirCargoPrice,
  calculateCompanionFee,
  getCountryById,
  getRegionById,
  type Region,
} from "@/data/worldLocations";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

export interface AirCargoResult {
  distanceKm: number;
  distanceMiles: number;
  flightTimeDisplay: string;
  hasCompanion: boolean;
  baseShippingPrice: number;
  companionFee: number;
  totalPrice: number;
  destinationLabel: string;
}

interface AirCargoSelectorProps {
  petLocation: string;
  petLocationCountry?: string;
  petLocationRegion?: string;
  onSelectionChange?: (result: AirCargoResult | null) => void;
  className?: string;
}

function parsePetLocation(location: string): { countryId: string; regionId: string } | null {
  const locationLower = location.toLowerCase();
  for (const country of worldCountries) {
    for (const region of country.regions) {
      if (locationLower.includes(region.name.toLowerCase())) {
        return { countryId: country.id, regionId: region.id };
      }
    }
  }
  return { countryId: "usa", regionId: "us-ca" };
}

export default function AirCargoSelector({
  petLocation,
  petLocationCountry,
  petLocationRegion,
  onSelectionChange,
  className,
}: AirCargoSelectorProps) {
  const { formatPrice } = useCart();

  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [hasCompanion, setHasCompanion] = useState(false);

  // Resolve pet origin
  const petLocationParsed = useMemo(() => {
    if (petLocationCountry && petLocationRegion) {
      return { countryId: petLocationCountry, regionId: petLocationRegion };
    }
    return parsePetLocation(petLocation);
  }, [petLocation, petLocationCountry, petLocationRegion]);

  const petOrigin = useMemo(() => {
    if (!petLocationParsed) return null;
    return getRegionById(petLocationParsed.countryId, petLocationParsed.regionId);
  }, [petLocationParsed]);

  const petLocationDisplay = useMemo(() => {
    if (petLocationCountry && petLocationRegion) {
      const country = getCountryById(petLocationCountry);
      const region = getRegionById(petLocationCountry, petLocationRegion);
      if (country && region) return `${region.name}, ${country.name}`;
    }
    return petLocation;
  }, [petLocation, petLocationCountry, petLocationRegion]);

  const selectedCountry = useMemo(
    () => (selectedCountryId ? getCountryById(selectedCountryId) : null),
    [selectedCountryId]
  );

  const selectedRegion = useMemo(
    () =>
      selectedCountryId && selectedRegionId
        ? getRegionById(selectedCountryId, selectedRegionId)
        : null,
    [selectedCountryId, selectedRegionId]
  );

  // Reset region when country changes
  useEffect(() => {
    setSelectedRegionId("");
  }, [selectedCountryId]);

  // Calculate result
  const result = useMemo<AirCargoResult | null>(() => {
    if (!petOrigin || !selectedRegion || !selectedCountry) return null;

    const distanceKm = calculateDistance(
      petOrigin.lat,
      petOrigin.lng,
      selectedRegion.lat,
      selectedRegion.lng
    );
    const distanceMiles = kmToMiles(distanceKm);
    const flightTime = estimateFlightTime(distanceKm);
    const basePrice = calculateAirCargoPrice(distanceKm);
    const companionFee = hasCompanion ? calculateCompanionFee(distanceKm) : 0;

    return {
      distanceKm: Math.round(distanceKm),
      distanceMiles: Math.round(distanceMiles),
      flightTimeDisplay: flightTime.display,
      hasCompanion,
      baseShippingPrice: Math.round(basePrice),
      companionFee,
      totalPrice: Math.round(basePrice) + companionFee,
      destinationLabel: `${selectedRegion.name}, ${selectedCountry.name}`,
    };
  }, [petOrigin, selectedRegion, selectedCountry, hasCompanion]);

  // Notify parent
  useEffect(() => {
    onSelectionChange?.(result);
  }, [result, onSelectionChange]);

  return (
    <div className={cn("space-y-5", className)}>
      {/* Header */}
      <div className="space-y-1">
        <h4 className="font-semibold flex items-center gap-2">
          <Plane className="h-5 w-5 text-blue-600" />
          Price Calculator – Air Cargo
        </h4>
        <p className="text-sm text-muted-foreground">
          Pet shipping from{" "}
          <span className="font-medium">{petLocationDisplay}</span>
        </p>
      </div>

      {/* Destination Selection */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Your Destination
        </Label>

        <Select value={selectedCountryId} onValueChange={setSelectedCountryId}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50 max-h-[300px]">
            {worldCountries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCountry && (
          <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
            <SelectTrigger className="bg-background">
              <SelectValue
                placeholder={`Select state/region in ${selectedCountry.name}`}
              />
            </SelectTrigger>
            <SelectContent className="bg-background z-50 max-h-[300px]">
              {selectedCountry.regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Companion Option */}
      {selectedRegion && (
        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg border transition-colors",
            hasCompanion
              ? "border-primary bg-primary/5"
              : "border-border hover:bg-muted/50"
          )}
        >
          <Checkbox
            id="air-companion"
            checked={hasCompanion}
            onCheckedChange={(checked) => setHasCompanion(checked === true)}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label
              htmlFor="air-companion"
              className="font-medium cursor-pointer flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-primary" />
              Add Personal Handler
              {result && (
                <span className="text-primary font-semibold text-sm">
                  +{formatPrice(result.companionFee || calculateCompanionFee(result.distanceKm))}
                </span>
              )}
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Your pet travels in-cabin with a personal escort who provides
              extra care, comfort, and attention during the entire flight.
              <span className="block mt-1 text-primary/80 font-medium">
                Short/Medium flights (&lt;3,000 km): +$300 · Long flights (≥3,000 km): +$700
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Trip Summary */}
      {result && (
        <>
          <Separator />
          <div className="space-y-4 animate-fade-in">
            <h4 className="font-semibold flex items-center gap-2">
              <Route className="h-4 w-4" />
              Flight Summary
            </h4>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Distance:</span>
              </div>
              <div className="font-medium text-right">
                {result.distanceKm.toLocaleString()} km (
                {result.distanceMiles.toLocaleString()} mi)
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Est. Flight Time:</span>
              </div>
              <div className="font-medium text-right">
                {result.flightTimeDisplay}
              </div>

              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Transport:</span>
              </div>
              <div className="font-medium text-right">Air Cargo</div>

              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Companion:</span>
              </div>
              <div className="font-medium text-right">
                {result.hasCompanion ? (
                  <Badge variant="default" className="text-xs">Yes</Badge>
                ) : (
                  "No"
                )}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Shipping Cost:</span>
                <span className="font-medium">{formatPrice(result.baseShippingPrice)}</span>
              </div>
              {result.hasCompanion && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Companion Cost:</span>
                  <span className="font-medium text-primary">
                    +{formatPrice(result.companionFee)}
                  </span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Total Air Shipping:
                </span>
                <span className="text-primary">
                  {formatPrice(result.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
