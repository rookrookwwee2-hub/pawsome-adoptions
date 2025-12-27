import { DollarSign } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CurrencySelector = () => {
  const { currency, setCurrency } = useCart();

  return (
    <Select value={currency} onValueChange={(value: "USD" | "CAD") => setCurrency(value)}>
      <SelectTrigger className="w-24 h-8 text-sm">
        <DollarSign className="w-3 h-3 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">USD</SelectItem>
        <SelectItem value="CAD">CAD</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
