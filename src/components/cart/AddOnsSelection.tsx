import { useState } from "react";
import { useCart, CartAddOn } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, Dna, Heart, FileCheck, Award, Package } from "lucide-react";

const availableAddOns: (CartAddOn & { icon: typeof Shield; description: string })[] = [
  {
    id: "fip-protection",
    name: "FIP Protection Plan",
    price: 349,
    icon: Shield,
    description: "36-month Feline Infectious Peritonitis protection",
  },
  {
    id: "extended-genetic",
    name: "Extended Genetic Health Guarantee",
    price: 299,
    icon: Dna,
    description: "3-year extended coverage for genetic conditions",
  },
  {
    id: "hcm-testing",
    name: "HCM Gene Testing",
    price: 150,
    icon: Heart,
    description: "Comprehensive Hypertrophic Cardiomyopathy testing",
  },
  {
    id: "pedigree",
    name: "Pedigree Certificate",
    price: 75,
    icon: FileCheck,
    description: "Official pedigree documentation",
  },
  {
    id: "breeding-rights",
    name: "Breeding Rights",
    price: 500,
    icon: Award,
    description: "Authorization for breeding purposes",
  },
  {
    id: "cattery-package",
    name: "Cattery Package",
    price: 199,
    icon: Package,
    description: "Starter kit with food, toys, and essentials",
  },
];

interface AddOnsSelectionProps {
  petId: string;
  onUpdate?: (addOns: CartAddOn[]) => void;
}

const AddOnsSelection = ({ petId, onUpdate }: AddOnsSelectionProps) => {
  const { items, updateAddOns, formatPrice } = useCart();
  const cartItem = items.find((item) => item.petId === petId);
  const [selectedAddOns, setSelectedAddOns] = useState<CartAddOn[]>(cartItem?.addOns || []);

  const toggleAddOn = (addOn: CartAddOn & { icon: typeof Shield; description: string }) => {
    const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
    let newAddOns: CartAddOn[];

    if (isSelected) {
      newAddOns = selectedAddOns.filter((a) => a.id !== addOn.id);
    } else {
      newAddOns = [...selectedAddOns, { id: addOn.id, name: addOn.name, price: addOn.price }];
    }

    setSelectedAddOns(newAddOns);
    updateAddOns(petId, newAddOns);
    onUpdate?.(newAddOns);
  };

  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center justify-between">
          <span>Optional Add-Ons</span>
          {addOnsTotal > 0 && (
            <span className="text-primary text-base">+{formatPrice(addOnsTotal)}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableAddOns.map((addOn) => {
          const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
          return (
            <div
              key={addOn.id}
              className={`flex items-start gap-4 p-3 rounded-lg border transition-colors cursor-pointer ${
                isSelected ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
              }`}
              onClick={() => toggleAddOn(addOn)}
            >
              <Checkbox
                id={addOn.id}
                checked={isSelected}
                onCheckedChange={() => toggleAddOn(addOn)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={addOn.id} className="font-medium cursor-pointer">
                  {addOn.name}
                </Label>
                <p className="text-sm text-muted-foreground">{addOn.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <addOn.icon className="w-4 h-4 text-primary" />
                <span className="font-semibold">{formatPrice(addOn.price)}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AddOnsSelection;
