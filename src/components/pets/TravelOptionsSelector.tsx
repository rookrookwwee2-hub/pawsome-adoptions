import { useState, useMemo } from "react";
import { Car, Plane, UserCheck, Globe, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { 
  GROUND_TRANSPORT_COUNTRIES, 
  AIR_CARGO_COUNTRIES 
} from "@/data/shippingCountries";

interface TravelOption {
  type: "ground" | "air";
  country: string;
  countryLabel: string;
  price: number;
  flightNanny: boolean;
  flightNannyPrice: number;
}

interface TravelOptionsSelectorProps {
  onSelectionChange?: (option: TravelOption | null) => void;
  flightNannyBasePrice?: number;
}

const TravelOptionsSelector = ({
  onSelectionChange,
  flightNannyBasePrice = 500,
}: TravelOptionsSelectorProps) => {
  const { formatPrice } = useCart();
  const [travelType, setTravelType] = useState<"ground" | "air" | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [flightNannyEnabled, setFlightNannyEnabled] = useState(false);

  const currentCountries = useMemo(() => {
    if (travelType === "ground") return GROUND_TRANSPORT_COUNTRIES;
    if (travelType === "air") return AIR_CARGO_COUNTRIES;
    return [];
  }, [travelType]);

  // Group air cargo countries by region for easier selection
  const groupedAirCountries = useMemo(() => {
    const groups: Record<string, typeof AIR_CARGO_COUNTRIES> = {};
    AIR_CARGO_COUNTRIES.forEach(country => {
      if (!groups[country.region]) {
        groups[country.region] = [];
      }
      groups[country.region].push(country);
    });
    return groups;
  }, []);

  const selectedCountryData = useMemo(() => {
    return currentCountries.find((c) => c.id === selectedCountry);
  }, [currentCountries, selectedCountry]);

  const totalPrice = useMemo(() => {
    if (!selectedCountryData) return 0;
    let price = selectedCountryData.price;
    if (travelType === "air" && flightNannyEnabled) {
      price += flightNannyBasePrice;
    }
    return price;
  }, [selectedCountryData, travelType, flightNannyEnabled, flightNannyBasePrice]);

  const handleTravelTypeChange = (value: "ground" | "air") => {
    setTravelType(value);
    setSelectedCountry("");
    setFlightNannyEnabled(false);
    onSelectionChange?.(null);
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    const countryData = currentCountries.find((c) => c.id === value);
    if (countryData && travelType) {
      onSelectionChange?.({
        type: travelType,
        country: value,
        countryLabel: countryData.label,
        price: countryData.price,
        flightNanny: travelType === "air" && flightNannyEnabled,
        flightNannyPrice: travelType === "air" && flightNannyEnabled ? flightNannyBasePrice : 0,
      });
    }
  };

  const handleFlightNannyChange = (checked: boolean) => {
    setFlightNannyEnabled(checked);
    if (selectedCountryData && travelType === "air") {
      onSelectionChange?.({
        type: "air",
        country: selectedCountry,
        countryLabel: selectedCountryData.label,
        price: selectedCountryData.price,
        flightNanny: checked,
        flightNannyPrice: checked ? flightNannyBasePrice : 0,
      });
    }
  };

  return (
    <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
          <Plane className="w-5 h-5" />
          Travel Options
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          Shipping from USA
          <span className="flex items-center gap-1 ml-2">
            <Clock className="w-4 h-4" />
            1-4 weeks delivery
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Travel Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Travel Type</Label>
          <RadioGroup
            value={travelType || ""}
            onValueChange={(val) => handleTravelTypeChange(val as "ground" | "air")}
            className="space-y-2"
          >
            <div
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                travelType === "ground"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
              onClick={() => handleTravelTypeChange("ground")}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="ground" id="ground" />
                <Car className="w-5 h-5 text-blue-600" />
                <div>
                  <Label htmlFor="ground" className="font-medium cursor-pointer">
                    Ground Transport
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Available for USA, Canada & Mexico
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                travelType === "air"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
              onClick={() => handleTravelTypeChange("air")}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="air" id="air" />
                <Plane className="w-5 h-5 text-blue-600" />
                <div>
                  <Label htmlFor="air" className="font-medium cursor-pointer">
                    Air Cargo
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    International shipping worldwide
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Country Selection */}
        {travelType && (
          <div className="space-y-3 animate-fade-in">
            <Label className="text-sm font-medium">
              Select Country 
              <span className="text-muted-foreground font-normal ml-1">
                ({currentCountries.length} destinations available)
              </span>
            </Label>
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Choose destination country" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50 max-h-[300px]">
                {travelType === "ground" ? (
                  // Ground transport - simple list
                  currentCountries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{country.label}</span>
                        <span className="text-primary font-semibold">
                          {formatPrice(country.price)}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  // Air cargo - grouped by region
                  Object.entries(groupedAirCountries).map(([region, countries]) => (
                    <div key={region}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                        {region}
                      </div>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span>{country.label}</span>
                            <span className="text-primary font-semibold">
                              {formatPrice(country.price)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Flight Nanny Option - Only for Air Cargo */}
        {travelType === "air" && (
          <div className="space-y-3 animate-fade-in">
            <div
              className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                flightNannyEnabled
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <Checkbox
                id="flight-nanny"
                checked={flightNannyEnabled}
                onCheckedChange={handleFlightNannyChange}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label
                  htmlFor="flight-nanny"
                  className="font-medium cursor-pointer flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-primary" />
                  Add Flight Nanny Service
                  <span className="text-primary font-semibold text-sm">
                    +{formatPrice(flightNannyBasePrice)}
                  </span>
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Your pet travels in-cabin with a personal escort who provides extra care,
                  comfort, and attention during the entire flight journey.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Price Summary */}
        {selectedCountryData && (
          <div className="pt-4 border-t border-border space-y-3 animate-fade-in">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Your Selection
            </h4>
            <div className="bg-background rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Travel Type:</span>
                <span className="font-medium">
                  {travelType === "ground" ? "Ground Transport" : "Air Cargo"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Destination:</span>
                <span className="font-medium">{selectedCountryData.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping Cost:</span>
                <span className="font-medium">
                  {formatPrice(selectedCountryData.price)}
                </span>
              </div>
              {travelType === "air" && flightNannyEnabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Flight Nanny:</span>
                  <span className="font-medium text-primary">
                    +{formatPrice(flightNannyBasePrice)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-dashed">
                <span className="font-semibold">Total Shipping:</span>
                <span className="font-bold text-lg text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelOptionsSelector;
