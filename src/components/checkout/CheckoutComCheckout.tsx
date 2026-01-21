import { useState, useEffect, useCallback } from "react";
import { Loader2, CreditCard, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  applePayEnabled?: boolean;
  googlePayEnabled?: boolean;
}

declare global {
  interface Window {
    Frames?: {
      init: (config: {
        publicKey: string;
        style?: Record<string, unknown>;
        localization?: Record<string, string>;
        modes?: string[];
      }) => void;
      addEventHandler: (
        event: string,
        handler: (event: {
          isValid?: boolean;
          isElementValid?: boolean;
          token?: string;
          scheme?: string;
          isPaymentRequestAvailable?: boolean;
        }) => void
      ) => void;
      submitCard: () => Promise<{ token: string; scheme: string }>;
      isCardValid: () => boolean;
      enableSubmitForm: () => void;
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
  applePayEnabled = true,
  googlePayEnabled = true,
}: CheckoutComCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [framesReady, setFramesReady] = useState(false);
  const [cardValid, setCardValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentRequestAvailable, setPaymentRequestAvailable] = useState(false);

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
          modes: ["cvv_optional"],
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

        // Check if Apple Pay / Google Pay is available
        window.Frames.addEventHandler("paymentMethodChanged", (event) => {
          if (event.isPaymentRequestAvailable) {
            setPaymentRequestAvailable(true);
          }
        });

        // Fallback in case frameActivated doesn't fire
        setTimeout(() => {
          if (!framesReady) {
            setFramesReady(true);
            setIsLoading(false);
          }
        }, 2000);

        // Check for Payment Request API support (Apple Pay / Google Pay)
        if (window.PaymentRequest) {
          checkPaymentRequestAvailability();
        }
      } catch (err) {
        console.error("Error initializing Frames:", err);
        setError("Failed to initialize payment form");
        setIsLoading(false);
      }
    };

    const checkPaymentRequestAvailability = async () => {
      // Only check if at least one wallet is enabled
      if (!applePayEnabled && !googlePayEnabled) {
        setPaymentRequestAvailable(false);
        return;
      }

      try {
        const supportedMethods = [];
        if (applePayEnabled) {
          supportedMethods.push({ supportedMethods: "https://apple.com/apple-pay" });
        }
        if (googlePayEnabled) {
          supportedMethods.push({ supportedMethods: "https://google.com/pay" });
        }
        
        const details = {
          total: {
            label: "Total",
            amount: { currency: currency.toUpperCase(), value: amount.toFixed(2) },
          },
        };

        const request = new PaymentRequest(supportedMethods, details);
        const canMakePayment = await request.canMakePayment();
        setPaymentRequestAvailable(canMakePayment);
      } catch {
        // Payment Request API not fully supported
        setPaymentRequestAvailable(false);
      }
    };

    loadFramesScript();

    return () => {
      // Cleanup if needed
    };
  }, [publicKey, amount, currency]);

  const handleDigitalWalletPayment = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Use Payment Request API for Apple Pay / Google Pay
      const supportedMethods = [
        {
          supportedMethods: "https://apple.com/apple-pay",
          data: {
            version: 3,
            merchantIdentifier: "merchant.com.checkout",
            merchantCapabilities: ["supports3DS"],
            supportedNetworks: ["visa", "masterCard", "amex"],
            countryCode: "US",
          },
        },
        {
          supportedMethods: "https://google.com/pay",
          data: {
            environment: publicKey.includes("sbox") ? "TEST" : "PRODUCTION",
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: "CARD",
                parameters: {
                  allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                  allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX"],
                },
                tokenizationSpecification: {
                  type: "PAYMENT_GATEWAY",
                  parameters: {
                    gateway: "checkoutltd",
                    gatewayMerchantId: publicKey,
                  },
                },
              },
            ],
            merchantInfo: {
              merchantName: "Petopia",
            },
          },
        },
      ];

      const details = {
        total: {
          label: "Petopia",
          amount: { currency: currency.toUpperCase(), value: amount.toFixed(2) },
        },
      };

      const request = new PaymentRequest(supportedMethods, details);
      const response = await request.show();

      // Get the payment token from the response
      const paymentData = response.details;

      // Create payment session via edge function with wallet token
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        "create-checkoutcom-session",
        {
          body: {
            amount,
            currency,
            metadata: {
              ...metadata,
              wallet_type: response.methodName.includes("apple") ? "apple_pay" : "google_pay",
              wallet_token: JSON.stringify(paymentData),
            },
          },
        }
      );

      await response.complete("success");

      if (sessionError) throw sessionError;

      if (sessionData?.error) {
        throw new Error(sessionData.error);
      }

      if (sessionData?.sessionId) {
        onSuccess(sessionData.sessionId);
        toast.success("Payment completed successfully!", {
          description: "Your payment has been processed.",
        });
      }
    } catch (err) {
      console.error("Digital wallet payment error:", err);
      if ((err as Error).name !== "AbortError") {
        const errorMessage = err instanceof Error ? err.message : "Payment failed";
        setError(errorMessage);
        toast.error(errorMessage);
        if (onError) {
          onError(err as Error);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  }, [amount, currency, metadata, onSuccess, onError, isProcessing, publicKey]);

  const handleCardSubmit = useCallback(async () => {
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
      {/* Apple Pay / Google Pay Buttons */}
      {paymentRequestAvailable && (applePayEnabled || googlePayEnabled) && (
        <>
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleDigitalWalletPayment}
              disabled={isProcessing}
              variant="outline"
              className="w-full h-12 bg-black text-white hover:bg-gray-800 border-0"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Smartphone className="h-5 w-5 mr-2" />
                  <span className="font-medium">
                    {applePayEnabled && googlePayEnabled 
                      ? "Pay with Apple Pay / Google Pay"
                      : applePayEnabled 
                        ? "Pay with Apple Pay" 
                        : "Pay with Google Pay"}
                  </span>
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Fast, secure payment with your digital wallet
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or pay with card</span>
            <Separator className="flex-1" />
          </div>
        </>
      )}

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
        onClick={handleCardSubmit}
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
