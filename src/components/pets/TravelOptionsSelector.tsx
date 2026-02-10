import { useState, useEffect } from "react";
import { Plane, Globe, Clock, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import GroundTransportSelector from "./GroundTransportSelector";
import AirCargoSelector, { type AirCargoResult } from "./AirCargoSelector";

interface TravelOption {
  type: "ground" | "air";
  country: string;
  countryLabel: string;
  price: number;
  flightNanny: boolean;
  flightNannyPrice: number;
}

interface GroundTransportResult {
  distanceKm: number;
  distanceMiles: number;
  estimatedTime: string;
  transportType: "standard" | "private";
  transportTypeName: string;
  hasCompanion: boolean;
  baseShippingPrice: number;
  companionFee: number;
  totalPrice: number;
}

interface TravelOptionsSelectorProps {
  onSelectionChange?: (option: TravelOption | null) => void;
  flightNannyBasePrice?: number;
  petLocation?: string;
  petLocationCountry?: string;
  petLocationRegion?: string;
}

const TravelOptionsSelector = ({
  onSelectionChange,
  flightNannyBasePrice = 500,
  petLocation = "California, USA",
  petLocationCountry,
  petLocationRegion,
}: TravelOptionsSelectorProps) => {
  const [travelType, setTravelType] = useState<"ground" | "air" | null>(null);
  const [groundTransportResult, setGroundTransportResult] = useState<GroundTransportResult | null>(null);

  const handleTravelTypeChange = (value: "ground" | "air") => {
    setTravelType(value);
    setGroundTransportResult(null);
    onSelectionChange?.(null);
  };

  // Handle ground transport selection changes
  const handleGroundTransportChange = (result: GroundTransportResult | null) => {
    setGroundTransportResult(result);
    if (result) {
      onSelectionChange?.({
        type: "ground",
        country: "ground_transport",
        countryLabel: `Ground Transport (${result.distanceKm.toLocaleString()} km)`,
        price: result.totalPrice,
        flightNanny: false,
        flightNannyPrice: 0,
      });
    } else {
      onSelectionChange?.(null);
    }
  };

  // Handle air cargo selection changes
  const handleAirCargoChange = (result: AirCargoResult | null) => {
    if (result) {
      onSelectionChange?.({
        type: "air",
        country: "air_cargo",
        countryLabel: `Air Cargo to ${result.destinationLabel}`,
        price: result.baseShippingPrice,
        flightNanny: result.hasCompanion,
        flightNannyPrice: result.companionFee,
      });
    } else {
      onSelectionChange?.(null);
    }
  };

  // When switching to ground, notify parent that selection cleared
  useEffect(() => {
    if (travelType === "ground" && !groundTransportResult) {
      onSelectionChange?.(null);
    }
  }, [travelType, groundTransportResult, onSelectionChange]);

  return (
    <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
          <Plane className="w-5 h-5" />
          Travel Options
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          Dynamic distance-based pricing
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
                <Truck className="w-5 h-5 text-emerald-600" />
                <div>
                  <Label htmlFor="ground" className="font-medium cursor-pointer">
                    Ground Transport
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Distance-based pricing with live calculator
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
                    International shipping with real-time flight pricing
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Ground Transport Calculator */}
        {travelType === "ground" && (
          <div className="animate-fade-in">
            <GroundTransportSelector
              petLocation={petLocation}
              petLocationCountry={petLocationCountry}
              petLocationRegion={petLocationRegion}
              onSelectionChange={handleGroundTransportChange}
              embedded
            />
          </div>
        )}

        {/* Air Cargo Calculator */}
        {travelType === "air" && (
          <div className="animate-fade-in">
            <AirCargoSelector
              petLocation={petLocation}
              petLocationCountry={petLocationCountry}
              petLocationRegion={petLocationRegion}
              onSelectionChange={handleAirCargoChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelOptionsSelector;
