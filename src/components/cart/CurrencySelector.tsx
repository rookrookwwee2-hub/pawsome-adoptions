import { DollarSign } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CurrencySelector = () => {
  const { currency } = useCart();

  return (
    <div className="flex items-center gap-1 px-3 h-8 text-sm border rounded-md bg-background">
      <DollarSign className="w-3 h-3" />
      <span>{currency}</span>
    </div>
  );
};

export default CurrencySelector;
