import { useState, useEffect, useCallback } from "react";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckoutComCheckoutProps {
  publicKey: string;
  amount: number;
  currency: string;
  onSuccess: (paymentId: string) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  metadata?: Record<string, string>;
}

declare global {
  interface Window {
    Frames?: {
      init: (config: {
        publicKey: string;
        style?: Record<string, unknown>;
        localization?: Record<string, string>;
      }) => void;
      addEventHandler: (
        event: string,
        handler: (event: {
          isValid?: boolean;
          isElementValid?: boolean;
          token?: string;
          scheme?: string;
        }) => void
      ) => void;
      submitCard: () => Promise<{ token: string; scheme: string }>;
      isCardValid: () => boolean;
    };
  }
}

const CheckoutComCheckout = ({
  publicKey,
  amount,
  currency,
  onSuccess,
  onError,
  metadata,
}: CheckoutComCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [framesReady, setFramesReady] = useState(false);
  const [cardValid, setCardValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Frames SDK
  useEffect(() => {
    const loadFramesScript = () => {
      // Check if already loaded
      if (window.Frames) {
        initializeFrames();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.checkout.com/js/framesv2.min.js";
      script.async = true;
      script.onload = () => {
        initializeFrames();
      };
      script.onerror = () => {
        setError("Failed to load payment form");
        setIsLoading(false);
      };
      document.body.appendChild(script);
    };

    const initializeFrames = () => {
      if (!window.Frames) {
        setError("Payment form not available");
        setIsLoading(false);
        return;
      }

      try {
        window.Frames.init({
          publicKey,
          style: {
            base: {
              fontSize: "16px",
              color: "#333",
            },
            focus: {
              color: "#7c3aed",
            },
            valid: {
              color: "#16a34a",
            },
            invalid: {
              color: "#dc2626",
            },
            placeholder: {
              base: {
                color: "#9ca3af",
              },
            },
          },
          localization: {
            cardNumberPlaceholder: "Card number",
            expiryMonthPlaceholder: "MM",
            expiryYearPlaceholder: "YY",
            cvvPlaceholder: "CVV",
          },
        });

        window.Frames.addEventHandler("frameActivated", () => {
          setFramesReady(true);
          setIsLoading(false);
        });

        window.Frames.addEventHandler("cardValidationChanged", (event) => {
          setCardValid(event.isValid || false);
        });

        window.Frames.addEventHandler("cardTokenizationFailed", () => {
          setError("Card tokenization failed");
          setIsProcessing(false);
        });

        // Fallback in case frameActivated doesn't fire
        setTimeout(() => {
          if (!framesReady) {
            setFramesReady(true);
            setIsLoading(false);
          }
        }, 2000);
      } catch (err) {
        console.error("Error initializing Frames:", err);
        setError("Failed to initialize payment form");
        setIsLoading(false);
      }
    };

    loadFramesScript();

    return () => {
      // Cleanup if needed
    };
  }, [publicKey]);

  const handleSubmit = useCallback(async () => {
    if (!window.Frames || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Tokenize the card
      const tokenResult = await window.Frames.submitCard();

      if (!tokenResult.token) {
        throw new Error("Card tokenization failed");
      }

      // Create payment session via edge function
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        "create-checkoutcom-session",
        {
          body: {
            amount,
            currency,
            metadata: {
              ...metadata,
              card_token: tokenResult.token,
              card_scheme: tokenResult.scheme,
            },
          },
        }
      );

      if (sessionError) throw sessionError;

      if (sessionData?.error) {
        throw new Error(sessionData.error);
      }

      // If we have a payment link, redirect to it
      if (sessionData?.paymentLink) {
        window.location.href = sessionData.paymentLink;
        return;
      }

      // If we got a session ID, we can consider it successful for now
      // The actual payment completion will be handled by webhook
      if (sessionData?.sessionId) {
        onSuccess(sessionData.sessionId);
        toast.success("Payment initiated successfully!", {
          description: "Your payment is being processed.",
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      const errorMessage = err instanceof Error ? err.message : "Payment failed";
      setError(errorMessage);
      toast.error(errorMessage);
      if (onError) {
        onError(err as Error);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [amount, currency, metadata, onSuccess, onError, isProcessing]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading payment form...</span>
      </div>
    );
  }

  if (error && !framesReady) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-sm text-destructive font-medium">⚠️ {error}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Please try a different payment method or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card Input Frame */}
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Card Number</label>
          <div
            className="card-number-frame h-10 px-3 py-2 border rounded-md bg-background"
            style={{ minHeight: "40px" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Expiry Date</label>
            <div
              className="expiry-date-frame h-10 px-3 py-2 border rounded-md bg-background"
              style={{ minHeight: "40px" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">CVV</label>
            <div
              className="cvv-frame h-10 px-3 py-2 border rounded-md bg-background"
              style={{ minHeight: "40px" }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span>Secured by Checkout.com. Your card info is encrypted.</span>
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isProcessing || !cardValid}
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

      <p className="text-xs text-center text-muted-foreground">
        Visa, MasterCard, American Express accepted
      </p>
    </div>
  );
};

export default CheckoutComCheckout;
