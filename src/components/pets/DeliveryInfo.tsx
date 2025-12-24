import { Truck, MapPin, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeliveryInfoProps {
  deliveryType?: string | null;
  deliveryNotes?: string | null;
  location?: string | null;
}

const DeliveryInfo = ({ deliveryType, deliveryNotes, location }: DeliveryInfoProps) => {
  const getDeliveryLabel = (type: string | null | undefined) => {
    switch (type) {
      case "pickup_only":
        return { label: "Local Pickup Only", icon: MapPin, description: "This pet is only available for local pickup at our facility." };
      case "delivery_only":
        return { label: "Delivery Available", icon: Truck, description: "This pet can be delivered to your location (delivery fees may apply)." };
      case "pickup_or_delivery":
      default:
        return { label: "Pickup or Delivery", icon: Truck, description: "This pet is available for both local pickup and delivery options." };
    }
  };

  const deliveryInfo = getDeliveryLabel(deliveryType);
  const IconComponent = deliveryInfo.icon;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <IconComponent className="h-5 w-5 text-primary" />
          {deliveryInfo.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {deliveryInfo.description}
        </p>

        {location && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>
              <strong>Pet Location:</strong> {location}
            </span>
          </div>
        )}

        {deliveryNotes && (
          <div className="flex items-start gap-2 text-sm bg-background/50 p-3 rounded-lg">
            <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{deliveryNotes}</span>
          </div>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Important:</strong> Delivery availability depends on the pet's current location and local regulations. 
            Shipping (if available) may include additional fees based on distance. 
            Please review delivery options carefully before proceeding with your adoption request.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default DeliveryInfo;
