import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Truck, 
  DollarSign, 
  MapPin, 
  Clock, 
  UserCheck, 
  Save,
  Settings,
  Info
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGroundTransportSettings, useUpdateGroundTransportSettings, type GroundTransportSettings } from "@/hooks/useGroundTransportSettings";

export default function GroundTransportSettingsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: settings, isLoading } = useGroundTransportSettings();
  const updateSettings = useUpdateGroundTransportSettings();

  const [formData, setFormData] = useState<Partial<GroundTransportSettings>>({
    base_price: 200,
    price_per_km: 0.80,
    price_per_mile: 1.29,
    standard_multiplier: 1.0,
    private_multiplier: 1.75,
    companion_base_fee: 150,
    companion_per_km: 0.10,
    companion_max_fee: 300,
    max_ground_distance_km: 5000,
    estimated_speed_kmh: 60,
    is_enabled: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        base_price: Number(settings.base_price),
        price_per_km: Number(settings.price_per_km),
        price_per_mile: Number(settings.price_per_mile),
        standard_multiplier: Number(settings.standard_multiplier),
        private_multiplier: Number(settings.private_multiplier),
        companion_base_fee: Number(settings.companion_base_fee),
        companion_per_km: Number(settings.companion_per_km),
        companion_max_fee: Number(settings.companion_max_fee),
        max_ground_distance_km: settings.max_ground_distance_km,
        estimated_speed_kmh: settings.estimated_speed_kmh,
        is_enabled: settings.is_enabled,
      });
    }
  }, [settings]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  const handleInputChange = (field: keyof GroundTransportSettings, value: number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  // Example calculation for preview
  const exampleDistance = 500; // km
  const exampleStandardPrice = (formData.base_price || 0) + (exampleDistance * (formData.price_per_km || 0));
  const examplePrivatePrice = exampleStandardPrice * (formData.private_multiplier || 1);
  const exampleCompanionFee = Math.min(
    (formData.companion_base_fee || 0) + (exampleDistance * (formData.companion_per_km || 0)),
    formData.companion_max_fee || 0
  );

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Ground Transport Settings | Admin | Pawsfam</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Truck className="h-8 w-8 text-primary" />
                Ground Transport Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure pricing, multipliers, and options for ground transportation
              </p>
            </div>
            <Button onClick={handleSave} disabled={updateSettings.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateSettings.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Enable/Disable */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Service Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_enabled" className="text-base">Enable Ground Transport</Label>
                      <p className="text-sm text-muted-foreground">
                        When disabled, ground transport option will not be available to customers
                      </p>
                    </div>
                    <Switch
                      id="is_enabled"
                      checked={formData.is_enabled}
                      onCheckedChange={(checked) => handleInputChange("is_enabled", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Base Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Base Pricing
                  </CardTitle>
                  <CardDescription>
                    Set the base price and per-distance rates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="base_price">Base Price ($)</Label>
                      <Input
                        id="base_price"
                        type="number"
                        step="0.01"
                        value={formData.base_price}
                        onChange={(e) => handleInputChange("base_price", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_per_km">Price per KM ($)</Label>
                      <Input
                        id="price_per_km"
                        type="number"
                        step="0.01"
                        value={formData.price_per_km}
                        onChange={(e) => handleInputChange("price_per_km", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_per_mile">Price per Mile ($)</Label>
                      <Input
                        id="price_per_mile"
                        type="number"
                        step="0.01"
                        value={formData.price_per_mile}
                        onChange={(e) => handleInputChange("price_per_mile", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Info className="h-4 w-4 inline mr-2" />
                    Formula: Base Price + (Distance × Price per KM)
                  </div>
                </CardContent>
              </Card>

              {/* Transport Type Multipliers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Transport Type Multipliers
                  </CardTitle>
                  <CardDescription>
                    Set price multipliers for different transport options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="standard_multiplier">Standard Transport (×)</Label>
                      <Input
                        id="standard_multiplier"
                        type="number"
                        step="0.1"
                        value={formData.standard_multiplier}
                        onChange={(e) => handleInputChange("standard_multiplier", parseFloat(e.target.value) || 1)}
                      />
                      <p className="text-xs text-muted-foreground">Shared transport with other pets</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="private_multiplier">Private VIP Transport (×)</Label>
                      <Input
                        id="private_multiplier"
                        type="number"
                        step="0.1"
                        value={formData.private_multiplier}
                        onChange={(e) => handleInputChange("private_multiplier", parseFloat(e.target.value) || 1)}
                      />
                      <p className="text-xs text-muted-foreground">Direct door-to-door private transport</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Companion Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Companion / Handler Fee
                  </CardTitle>
                  <CardDescription>
                    Configure pricing for optional pet companion during transport
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="companion_base_fee">Base Fee ($)</Label>
                      <Input
                        id="companion_base_fee"
                        type="number"
                        step="0.01"
                        value={formData.companion_base_fee}
                        onChange={(e) => handleInputChange("companion_base_fee", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companion_per_km">Per KM ($)</Label>
                      <Input
                        id="companion_per_km"
                        type="number"
                        step="0.01"
                        value={formData.companion_per_km}
                        onChange={(e) => handleInputChange("companion_per_km", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companion_max_fee">Maximum Fee ($)</Label>
                      <Input
                        id="companion_max_fee"
                        type="number"
                        step="0.01"
                        value={formData.companion_max_fee}
                        onChange={(e) => handleInputChange("companion_max_fee", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Distance & Time Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Distance & Time Settings
                  </CardTitle>
                  <CardDescription>
                    Configure maximum distance and estimated travel speed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="max_ground_distance_km">Maximum Distance (km)</Label>
                      <Input
                        id="max_ground_distance_km"
                        type="number"
                        value={formData.max_ground_distance_km}
                        onChange={(e) => handleInputChange("max_ground_distance_km", parseInt(e.target.value) || 0)}
                      />
                      <p className="text-xs text-muted-foreground">Beyond this distance, air cargo will be recommended</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimated_speed_kmh">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Average Speed (km/h)
                      </Label>
                      <Input
                        id="estimated_speed_kmh"
                        type="number"
                        value={formData.estimated_speed_kmh}
                        onChange={(e) => handleInputChange("estimated_speed_kmh", parseInt(e.target.value) || 0)}
                      />
                      <p className="text-xs text-muted-foreground">Used to calculate estimated delivery time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Pricing Preview
                  </CardTitle>
                  <CardDescription>
                    Example calculation for 500 km distance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Distance:</span>
                      <span className="font-medium">{exampleDistance} km</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Calculation:</span>
                      <span className="font-medium">${formData.base_price} + ({exampleDistance} × ${formData.price_per_km})</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Standard:
                      </span>
                      <Badge variant="secondary">
                        ${exampleStandardPrice.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Private VIP:
                      </span>
                      <Badge>
                        ${examplePrivatePrice.toFixed(2)}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Companion Fee:
                      </span>
                      <Badge variant="outline">
                        ${exampleCompanionFee.toFixed(2)}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Private + Companion:</span>
                      <span className="text-primary">
                        ${(examplePrivatePrice + exampleCompanionFee).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Estimated Time:</span>
                    </div>
                    <p className="text-muted-foreground">
                      {Math.round(exampleDistance / (formData.estimated_speed_kmh || 60))} hours
                      ({Math.round(exampleDistance / (formData.estimated_speed_kmh || 60) / 24)} days)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
