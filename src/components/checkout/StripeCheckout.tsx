import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StripeCheckoutProps {
  publishableKey: string;
  amount: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  metadata?: Record<string, string>;
}

const CheckoutForm = ({
  amount,
  currency,
  onSuccess,
  onError,
}: {
  amount: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onError?: (error: Error) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout?payment_status=success`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error);
        if (onError) {
          onError(new Error(error.message));
        }
        toast.error(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
        toast.success("Payment completed successfully!", {
          description: `Payment ID: ${paymentIntent.id.slice(-8)}`,
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      if (onError) {
        onError(err as Error);
      }
      toast.error("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        options={{
          layout: "tabs",
        }}
      />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span>Secured by Stripe. Your payment info is encrypted.</span>
      </div>
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay {currency} {amount.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
};

const StripeCheckout = ({
  publishableKey,
  amount,
  currency,
  onSuccess,
  onError,
  metadata,
}: StripeCheckoutProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);

  useEffect(() => {
    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, [publishableKey]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fnError } = await supabase.functions.invoke(
          "create-stripe-payment-intent",
          {
            body: { 
              amount, 
              currency,
              metadata,
            },
          }
        );

        if (fnError) throw fnError;

        if (data?.error) {
          throw new Error(data.error);
        }

        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error("No client secret received");
        }
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize payment");
        if (onError) {
          onError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, currency, metadata, onError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Initializing payment...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-sm text-destructive font-medium">
          ⚠️ {error}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Please try a different payment method or contact support.
        </p>
      </div>
    );
  }

  if (!clientSecret || !stripePromise) {
    return (
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Unable to initialize Stripe. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#7c3aed",
            borderRadius: "8px",
          },
        },
      }}
    >
      <CheckoutForm
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripeCheckout;
