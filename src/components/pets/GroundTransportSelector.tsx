import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Truck, 
  Car, 
  UserCheck, 
  MapPin, 
  Clock, 
  Route,
  DollarSign,
  AlertCircle 
} from "lucide-react";
import { 
  worldCountries, 
  calculateDistance, 
  kmToMiles,
  estimateTravelTime,
  getCountryById,
  getRegionById,
  type Country,
  type Region 
} from "@/data/worldLocations";
import { useGroundTransportSettings } from "@/hooks/useGroundTransportSettings";
import { cn } from "@/lib/utils";

type TransportType = "standard" | "private";

interface GroundTransportResult {
  distanceKm: number;
  distanceMiles: number;
  estimatedTime: string;
  transportType: TransportType;
  transportTypeName: string;
  hasCompanion: boolean;
  baseShippingPrice: number;
  companionFee: number;
  totalPrice: number;
}

interface GroundTransportSelectorProps {
  petLocation: string; // e.g., "California, USA"
  onSelectionChange?: (result: GroundTransportResult | null) => void;
  className?: string;
}

// Parse pet location to find matching region
function parsePetLocation(location: string): { countryId: string; regionId: string } | null {
  const locationLower = location.toLowerCase();
  
  // Try to find a matching region in any country
  for (const country of worldCountries) {
    for (const region of country.regions) {
      if (locationLower.includes(region.name.toLowerCase()) || 
          locationLower.includes(country.name.toLowerCase())) {
        // Check if this specific region matches
        if (locationLower.includes(region.name.toLowerCase())) {
          return { countryId: country.id, regionId: region.id };
        }
      }
    }
  }
  
  // Default to California, USA if not found
  return { countryId: "usa", regionId: "us-ca" };
}

export default function GroundTransportSelector({
  petLocation,
  onSelectionChange,
  className,
}: GroundTransportSelectorProps) {
  const { data: settings, isLoading: settingsLoading } = useGroundTransportSettings();
  
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [transportType, setTransportType] = useState<TransportType>("standard");
  const [hasCompanion, setHasCompanion] = useState(false);

  // Parse pet location
  const petLocationParsed = useMemo(() => parsePetLocation(petLocation), [petLocation]);
  
  // Get selected country and region
  const selectedCountry = useMemo(
    () => (selectedCountryId ? getCountryById(selectedCountryId) : null),
    [selectedCountryId]
  );
  
  const selectedRegion = useMemo(
    () => (selectedCountryId && selectedRegionId 
      ? getRegionById(selectedCountryId, selectedRegionId) 
      : null),
    [selectedCountryId, selectedRegionId]
  );

  // Get pet origin coordinates
  const petOrigin = useMemo(() => {
    if (!petLocationParsed) return null;
    return getRegionById(petLocationParsed.countryId, petLocationParsed.regionId);
  }, [petLocationParsed]);

  // Calculate distance and pricing
  const result = useMemo<GroundTransportResult | null>(() => {
    if (!settings || !petOrigin || !selectedRegion) return null;

    const distanceKm = calculateDistance(
      petOrigin.lat,
      petOrigin.lng,
      selectedRegion.lat,
      selectedRegion.lng
    );
    const distanceMiles = kmToMiles(distanceKm);

    // Check if distance exceeds maximum
    if (distanceKm > settings.max_ground_distance_km) {
      return null; // Too far for ground transport
    }

    const estimatedTime = estimateTravelTime(distanceKm, settings.estimated_speed_kmh);

    // Calculate base shipping price
    const multiplier = transportType === "standard" 
      ? settings.standard_multiplier 
      : settings.private_multiplier;
    const baseShippingPrice = (settings.base_price + (distanceKm * settings.price_per_km)) * multiplier;

    // Calculate companion fee if selected
    let companionFee = 0;
    if (hasCompanion) {
      companionFee = Math.min(
        settings.companion_base_fee + (distanceKm * settings.companion_per_km),
        settings.companion_max_fee
      );
    }

    const totalPrice = baseShippingPrice + companionFee;

    return {
      distanceKm: Math.round(distanceKm),
      distanceMiles: Math.round(distanceMiles),
      estimatedTime,
      transportType,
      transportTypeName: transportType === "standard" ? "Standard Ground Transport" : "Private VIP Transport",
      hasCompanion,
      baseShippingPrice: Math.round(baseShippingPrice * 100) / 100,
      companionFee: Math.round(companionFee * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100,
    };
  }, [settings, petOrigin, selectedRegion, transportType, hasCompanion]);

  // Notify parent of changes
  useEffect(() => {
    onSelectionChange?.(result);
  }, [result, onSelectionChange]);

  // Reset region when country changes
  useEffect(() => {
    setSelectedRegionId("");
  }, [selectedCountryId]);

  const isDistanceTooFar = useMemo(() => {
    if (!settings || !petOrigin || !selectedRegion) return false;
    const distanceKm = calculateDistance(
      petOrigin.lat,
      petOrigin.lng,
      selectedRegion.lat,
      selectedRegion.lng
    );
    return distanceKm > settings.max_ground_distance_km;
  }, [settings, petOrigin, selectedRegion]);

  if (settingsLoading) {
    return (
      <Card className={cn("border-2", className)}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!settings?.is_enabled) {
    return null; // Ground transport not available
  }

  return (
    <Card className={cn("border-2 border-primary/20", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="h-5 w-5 text-primary" />
          Ground Transportation
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pet shipping from <span className="font-medium">{petLocation}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Selection */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Your Destination
          </Label>
          
          {/* Country Selector */}
          <Select value={selectedCountryId} onValueChange={setSelectedCountryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
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

          {/* Region Selector */}
          {selectedCountry && (
            <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
              <SelectTrigger>
                <SelectValue placeholder={`Select state/region in ${selectedCountry.name}`} />
              </SelectTrigger>
              <SelectContent>
                {selectedCountry.regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Distance Too Far Warning */}
        {isDistanceTooFar && selectedRegion && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Distance Too Far</p>
              <p className="text-sm text-muted-foreground">
                Ground transport is only available for distances up to {settings.max_ground_distance_km.toLocaleString()} km.
                Consider air cargo for this destination.
              </p>
            </div>
          </div>
        )}

        {/* Transport Type Selection */}
        {selectedRegion && !isDistanceTooFar && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label>Transport Type</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTransportType("standard")}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    transportType === "standard"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="font-medium">Standard</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      ×{settings.standard_multiplier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Shared ground transport with other pets
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setTransportType("private")}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    transportType === "private"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Car className="h-5 w-5 text-primary" />
                    <span className="font-medium">Private VIP</span>
                    <Badge className="ml-auto text-xs">
                      ×{settings.private_multiplier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Direct door-to-door private transport
                  </p>
                </button>
              </div>
            </div>

            {/* Companion Option */}
            <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
              <Checkbox
                id="companion"
                checked={hasCompanion}
                onCheckedChange={(checked) => setHasCompanion(checked === true)}
              />
              <div className="flex-1">
                <Label htmlFor="companion" className="flex items-center gap-2 cursor-pointer">
                  <UserCheck className="h-4 w-4 text-primary" />
                  Add Personal Handler / Companion
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  A dedicated handler will accompany your pet during the entire journey.
                  <span className="text-primary font-medium ml-1">
                    +${settings.companion_base_fee} - ${settings.companion_max_fee}
                  </span>
                </p>
              </div>
            </div>
          </>
        )}

        {/* Trip Summary */}
        {result && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Route className="h-4 w-4" />
                Trip Summary
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Distance:</span>
                </div>
                <div className="font-medium text-right">
                  {result.distanceKm.toLocaleString()} km ({result.distanceMiles.toLocaleString()} mi)
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Est. Time:</span>
                </div>
                <div className="font-medium text-right">
                  {result.estimatedTime}
                </div>
                
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Transport:</span>
                </div>
                <div className="font-medium text-right">
                  {result.transportTypeName}
                </div>
                
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Companion:</span>
                </div>
                <div className="font-medium text-right">
                  {result.hasCompanion ? "Yes" : "No"}
                </div>
              </div>
              
              {/* Pricing Breakdown */}
              <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Cost:</span>
                  <span>${result.baseShippingPrice.toFixed(2)}</span>
                </div>
                {result.hasCompanion && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Companion Fee:</span>
                    <span>${result.companionFee.toFixed(2)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Total Shipping:
                  </span>
                  <span className="text-primary">${result.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
