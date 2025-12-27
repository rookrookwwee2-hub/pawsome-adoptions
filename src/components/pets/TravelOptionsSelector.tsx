import { useState, useMemo } from "react";
import { Car, Plane, UserCheck, Globe, Clock, MapPin, Info, Copy, Check } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

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

const GROUND_TRANSPORT_COUNTRIES = [
  { id: "usa", label: "USA (Domestic)", price: 200 },
  { id: "canada", label: "Canada", price: 400 },
  { id: "mexico", label: "Mexico", price: 600 },
];

const AIR_CARGO_COUNTRIES = [
  { id: "uk", label: "United Kingdom", price: 3395 },
  { id: "germany", label: "Germany", price: 3595 },
  { id: "france", label: "France", price: 3695 },
  { id: "italy", label: "Italy", price: 3595 },
  { id: "spain", label: "Spain", price: 3795 },
  { id: "netherlands", label: "Netherlands", price: 3695 },
  { id: "belgium", label: "Belgium", price: 3695 },
  { id: "switzerland", label: "Switzerland", price: 3595 },
  { id: "sweden", label: "Sweden", price: 3800 },
  { id: "norway", label: "Norway", price: 3900 },
  { id: "finland", label: "Finland", price: 3900 },
  { id: "denmark", label: "Denmark", price: 3800 },
  { id: "poland", label: "Poland", price: 3700 },
  { id: "romania", label: "Romania", price: 3800 },
  { id: "czech_republic", label: "Czech Republic", price: 3750 },
  { id: "hungary", label: "Hungary", price: 3750 },
  { id: "slovenia", label: "Slovenia", price: 3800 },
  { id: "australia", label: "Australia", price: 5295 },
  { id: "new_zealand", label: "New Zealand", price: 5295 },
  { id: "japan", label: "Japan", price: 2695 },
  { id: "south_korea", label: "South Korea", price: 3500 },
  { id: "china", label: "China", price: 4000 },
  { id: "russia", label: "Russia", price: 3800 },
  { id: "brazil", label: "Brazil", price: 4250 },
  { id: "argentina", label: "Argentina", price: 4250 },
];

// Domestic ground transport prices (within same country)
const DOMESTIC_GROUND_PRICES = [
  { country: "United States", price: 800 },
  { country: "Canada", price: 550 },
  { country: "United Kingdom", price: 375 },
  { country: "Germany", price: 440 },
  { country: "France", price: 385 },
  { country: "Italy", price: 410 },
  { country: "Spain", price: 410 },
  { country: "Netherlands", price: 385 },
  { country: "Belgium", price: 385 },
  { country: "Switzerland", price: 410 },
  { country: "Sweden", price: 440 },
  { country: "Norway", price: 450 },
  { country: "Finland", price: 450 },
  { country: "Denmark", price: 440 },
  { country: "Poland", price: 385 },
  { country: "Romania", price: 410 },
  { country: "Czech Republic", price: 385 },
  { country: "Hungary", price: 385 },
  { country: "Slovenia", price: 410 },
  { country: "Australia", price: 395 },
  { country: "New Zealand", price: 395 },
  { country: "Japan", price: 500 },
  { country: "South Korea", price: 500 },
  { country: "China", price: 550 },
  { country: "Russia", price: 725 },
  { country: "Brazil", price: 500 },
  { country: "Argentina", price: 500 },
];

const TravelOptionsSelector = ({
  onSelectionChange,
  flightNannyBasePrice = 500,
}: TravelOptionsSelectorProps) => {
  const { formatPrice } = useCart();
  const [travelType, setTravelType] = useState<"ground" | "air" | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [flightNannyEnabled, setFlightNannyEnabled] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyPrice = (country: string, price: number, index: number) => {
    const text = `${country}: $${price}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAllPrices = () => {
    const allPrices = DOMESTIC_GROUND_PRICES.map(
      (item) => `${item.country}: $${item.price}`
    ).join("\n");
    navigator.clipboard.writeText(allPrices);
    toast.success("All prices copied to clipboard!");
  };

  const currentCountries = useMemo(() => {
    if (travelType === "ground") return GROUND_TRANSPORT_COUNTRIES;
    if (travelType === "air") return AIR_CARGO_COUNTRIES;
    return [];
  }, [travelType]);

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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Plane className="w-5 h-5" />
            Travel Options
          </CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 h-8 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                <Info className="w-3.5 h-3.5" />
                Domestic Prices
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-0 bg-background border shadow-lg z-50" 
              align="end"
              sideOffset={8}
            >
              <div className="p-3 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">Domestic Ground Transport</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Average prices within the same country
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={handleCopyAllPrices}
                  >
                    <Copy className="w-3 h-3" />
                    Copy All
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-64">
                <div className="p-2">
                  {DOMESTIC_GROUND_PRICES.map((item, index) => (
                    <div
                      key={item.country}
                      className="flex items-center justify-between py-2 px-2 rounded hover:bg-muted/50 group transition-colors"
                    >
                      <span className="text-sm">{item.country}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary text-sm">
                          ${item.price}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleCopyPrice(item.country, item.price, index)}
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
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
            <Label className="text-sm font-medium">Select Country</Label>
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Choose destination country" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {currentCountries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{country.label}</span>
                      <span className="text-primary font-semibold">
                        {formatPrice(country.price)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
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
