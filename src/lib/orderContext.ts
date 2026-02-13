// Stores and retrieves order context for auto-filling payment proof forms

export interface OrderContext {
  petId: string;
  petName: string;
  petType?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerMessage: string;
  paymentMethod: string;
  paymentMethodLabel: string;
  shippingMethod: string;
  shippingCost: number;
  addOns: { name: string; price: number }[];
  addOnsTotal: number;
  basePrice: number;
  totalAmount: number;
  currency: string;
  isReservation: boolean;
  reservationDeposit?: number;
  createdAt: string;
}

const STORAGE_KEY = "pawsfam_last_order";

export const saveOrderContext = (order: OrderContext) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch (e) {
    console.error("Failed to save order context:", e);
  }
};

export const getOrderContext = (): OrderContext | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OrderContext;
  } catch (e) {
    console.error("Failed to read order context:", e);
    return null;
  }
};

export const clearOrderContext = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear order context:", e);
  }
};

export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    usdt: "USDT TRC20",
    bank_uk: "UK BACS/Faster Payments",
    bank_usa: "USA Wire Transfer",
    bank_eu: "SEPA Transfer",
    paypal: "PayPal",
    stripe: "Stripe Card Payment",
    checkoutcom: "Credit/Debit Card",
  };
  return labels[method] || method;
};
