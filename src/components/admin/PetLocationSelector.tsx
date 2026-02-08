import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { worldCountries, getCountryById, getRegionById } from "@/data/worldLocations";

interface PetLocationSelectorProps {
  countryId: string;
  regionId: string;
  onCountryChange: (countryId: string) => void;
  onRegionChange: (regionId: string) => void;
}

export default function PetLocationSelector({
  countryId,
  regionId,
  onCountryChange,
  onRegionChange,
}: PetLocationSelectorProps) {
  const selectedCountry = useMemo(
    () => (countryId ? getCountryById(countryId) : null),
    [countryId]
  );

  // Get display values for the current selection
  const locationDisplay = useMemo(() => {
    if (!countryId || !regionId) return null;
    const country = getCountryById(countryId);
    const region = getRegionById(countryId, regionId);
    if (country && region) {
      return `${region.name}, ${country.name}`;
    }
    return null;
  }, [countryId, regionId]);

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        Pet Location
      </Label>
      
      {locationDisplay && (
        <p className="text-sm text-muted-foreground">
          Current: <span className="font-medium">{locationDisplay}</span>
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Country Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Country</Label>
          <Select value={countryId} onValueChange={(value) => {
            onCountryChange(value);
            onRegionChange(""); // Reset region when country changes
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
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
        </div>

        {/* Region Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">State / Region</Label>
          <Select 
            value={regionId} 
            onValueChange={onRegionChange}
            disabled={!selectedCountry}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedCountry ? "Select region" : "Select country first"} />
            </SelectTrigger>
            <SelectContent>
              {selectedCountry?.regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
