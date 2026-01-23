import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileCartIndicator = () => {
  const { items, formatPrice, getTotal } = useCart();
  const isMobile = useIsMobile();
  const cartItemCount = items.length;
  const cartTotal = getTotal();

  // Only show on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <Link
      to="/checkout"
      className="fixed top-24 right-4 z-40 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg hover:bg-primary/90 transition-all animate-fade-in"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-background text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
            {cartItemCount > 9 ? "9+" : cartItemCount}
          </span>
        )}
      </div>
      {cartItemCount > 0 ? (
        <>
          <span className="font-semibold text-sm">
            {cartItemCount} {cartItemCount === 1 ? "pet" : "pets"}
          </span>
          <span className="text-xs opacity-90">•</span>
          <span className="font-bold text-sm">{formatPrice(cartTotal)}</span>
        </>
      ) : (
        <span className="font-semibold text-sm">Cart</span>
      )}
    </Link>
  );
};

export default MobileCartIndicator;
