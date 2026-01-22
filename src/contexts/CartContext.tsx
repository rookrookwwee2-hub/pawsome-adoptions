import { createContext, useContext, useState, ReactNode } from "react";

export interface CartAddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface CartItem {
  petId: string;
  petName: string;
  petImage?: string;
  basePrice: number;
  addOns: CartAddOn[];
  shippingMethod?: {
    id: string;
    name: string;
    price: number;
  };
  isReservation?: boolean;
  reservationDeposit?: number;
}

interface CartContextType {
  items: CartItem[];
  currency: "USD";
  setCurrency: (currency: "USD") => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (petId: string) => void;
  updateAddOns: (petId: string, addOns: CartAddOn[]) => void;
  updateShipping: (petId: string, shipping: { id: string; name: string; price: number }) => void;
  getTotal: () => number;
  clearCart: () => void;
  exchangeRate: number;
  formatPrice: (price: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<"USD">("USD");

  const exchangeRate = 1;

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.petId === item.petId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = item;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (petId: string) => {
    setItems((prev) => prev.filter((item) => item.petId !== petId));
  };

  const updateAddOns = (petId: string, addOns: CartAddOn[]) => {
    setItems((prev) =>
      prev.map((item) =>
        item.petId === petId ? { ...item, addOns } : item
      )
    );
  };

  const updateShipping = (petId: string, shipping: { id: string; name: string; price: number }) => {
    setItems((prev) =>
      prev.map((item) =>
        item.petId === petId ? { ...item, shippingMethod: shipping } : item
      )
    );
  };

  const getTotal = (): number => {
    return items.reduce((total, item) => {
      const itemTotal = item.isReservation && item.reservationDeposit
        ? item.reservationDeposit
        : item.basePrice;
      const addOnsTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
      const shippingTotal = item.shippingMethod?.price || 0;
      return total + itemTotal + addOnsTotal + shippingTotal;
    }, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        currency,
        setCurrency,
        addToCart,
        removeFromCart,
        updateAddOns,
        updateShipping,
        getTotal,
        clearCart,
        exchangeRate,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
