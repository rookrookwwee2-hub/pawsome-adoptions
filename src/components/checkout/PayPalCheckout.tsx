import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PayPalCheckoutProps {
  clientId: string;
  amount: number;
  currency: string;
  onSuccess: (orderId: string, payerId: string) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  mode?: "sandbox" | "live";
}

const PayPalCheckout = ({
  clientId,
  amount,
  currency,
  onSuccess,
  onError,
  onCancel,
  mode = "sandbox",
}: PayPalCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const initialOptions = {
    clientId,
    currency: currency || "USD",
    intent: "capture",
    ...(mode === "sandbox" && { "data-client-token": undefined }),
  };

  return (
    <div className="w-full min-h-[150px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading PayPal...</span>
        </div>
      )}
      
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            layout: "vertical",
            shape: "rect",
            label: "paypal",
            height: 50,
          }}
          disabled={false}
          forceReRender={[amount, currency]}
          onInit={() => setIsLoading(false)}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: currency || "USD",
                    value: amount.toFixed(2),
                  },
                  description: "Pet Adoption Payment",
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              if (actions.order) {
                const order = await actions.order.capture();
                const payerId = order.payer?.payer_id || data.payerID || "";
                onSuccess(order.id || data.orderID || "", payerId);
                toast.success("Payment completed successfully!", {
                  description: `Order ID: ${order.id}`,
                });
              }
            } catch (error) {
              console.error("PayPal capture error:", error);
              if (onError) {
                onError(error as Error);
              }
              toast.error("Payment capture failed. Please try again.");
            }
          }}
          onCancel={() => {
            if (onCancel) {
              onCancel();
            }
            toast.info("Payment cancelled", {
              description: "You can try again when you're ready.",
            });
          }}
          onError={(err) => {
            console.error("PayPal error:", err);
            if (onError) {
              onError(new Error(typeof err === 'object' ? JSON.stringify(err) : String(err)));
            }
            toast.error("PayPal encountered an error. Please try again.");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalCheckout;
