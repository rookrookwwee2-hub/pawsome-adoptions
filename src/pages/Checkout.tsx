import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import {
  ShoppingCart,
  Trash2,
  CheckCircle2,
  Loader2,
  Building2,
  Copy,
  Check,
  Wallet,
  ArrowLeft,
  Package,
  Truck,
  Shield,
  CreditCard,
} from "lucide-react";
import PayPalCheckout from "@/components/checkout/PayPalCheckout";
import StripeCheckout from "@/components/checkout/StripeCheckout";
import CheckoutComCheckout from "@/components/checkout/CheckoutComCheckout";
import PaymentSuggestionDialog from "@/components/checkout/PaymentSuggestionDialog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Fallback values while loading from database
const fallbackBankDetails = [
  {
    id: "uk",
    region: "UK Local Bank Transfer",
    subtitle: "BACS / Faster Payments",
    currency: "GBP",
    details: [
      { label: "Bank Name", value: "Barclays" },
      { label: "Sort Code", value: "23-14-86" },
      { label: "Account Number", value: "15870922" },
      { label: "Beneficiary Name", value: "Kenneth Roberts" },
    ],
  },
  {
    id: "usa",
    region: "USA Local Bank Transfer",
    subtitle: "ACH / Wire",
    currency: "USD",
    details: [
      { label: "Bank Name", value: "Citibank" },
      { label: "Bank Address", value: "111 Wall Street, New York, NY 10043, USA" },
      { label: "Routing (ABA)", value: "031100209" },
      { label: "Account Number", value: "70589140002133813" },
      { label: "Account Type", value: "Checking" },
      { label: "Beneficiary Name", value: "Kenneth Roberts" },
    ],
  },
  {
    id: "eu",
    region: "Eurozone SEPA Bank Transfer",
    subtitle: "SEPA",
    currency: "EUR",
    details: [
      { label: "Bank Name", value: "Banking Circle S.A." },
      { label: "Bank Address", value: "2, Boulevard de la Foire, L-1528 Luxembourg" },
      { label: "IBAN", value: "LU63 4080 0000 5965 4770" },
      { label: "BIC (SWIFT)", value: "BCIRLULL" },
      { label: "Beneficiary Name", value: "Kenneth Roberts" },
    ],
  },
];

const fallbackUsdtDetails = {
  network: "TRC20 (Tron)",
  walletAddress: "TXYZabc123def456ghi789jkl012mno345pqr",
  note: "Only send USDT on TRC20 network. Other networks will result in loss of funds.",
};

const CopyableDetail = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-2 text-sm group">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono font-medium text-foreground break-all">{value}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 rounded hover:bg-muted transition-colors shrink-0"
          title={`Copy ${label}`}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  phone: z.string().optional(),
  address: z.string().min(5, "Please enter your full address").max(500),
  paymentMethod: z.enum(["usdt", "bank_uk", "bank_usa", "bank_eu", "paypal", "stripe", "checkoutcom"], {
    required_error: "Please select a payment method",
  }),
  message: z.string().max(500).optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, formatPrice, removeFromCart, clearCart, currency, exchangeRate } = useCart();
  const { user } = useAuth();
  const { usdtSettings, bankSettings, paypalSettings, stripeSettings, checkoutcomSettings, loading: settingsLoading } = usePaymentSettings();
  const [step, setStep] = useState<"details" | "payment" | "confirmation">("details");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use database settings or fallback to defaults
  const bankDetails = bankSettings.length > 0 ? bankSettings : fallbackBankDetails;
  const usdtDetails = usdtSettings || fallbackUsdtDetails;
  
  // Check if PayPal is enabled and properly configured
  const isPayPalEnabled = paypalSettings?.enabled && paypalSettings?.clientId;
  
  // Check if Stripe is enabled and properly configured
  const isStripeEnabled = stripeSettings?.enabled && stripeSettings?.publishableKey;

  // Check if Checkout.com is enabled and properly configured
  const isCheckoutComEnabled = checkoutcomSettings?.enabled && checkoutcomSettings?.publicKey;

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      phone: "",
      address: "",
      paymentMethod: undefined,
      message: "",
      acceptTerms: false,
    },
  });

  const selectedPaymentMethod = form.watch("paymentMethod");
  const selectedBank = bankDetails.find(
    (b) => `bank_${b.id}` === selectedPaymentMethod
  );

  const subtotal = getTotal();
  const total = subtotal * exchangeRate;

  const handleDetailsSubmit = (data: CheckoutFormData) => {
    setStep("payment");
  };

  const handlePaymentConfirm = async () => {
    const values = form.getValues();
    setIsSubmitting(true);

    try {
      // Create guest payment records for each item
      for (const item of items) {
        const { error } = await supabase.from("guest_payments").insert({
          pet_id: item.petId,
          guest_name: values.name,
          guest_email: values.email,
          guest_phone: values.phone || null,
          guest_address: values.address || null,
          amount: item.isReservation && item.reservationDeposit
            ? item.reservationDeposit
            : item.basePrice + item.addOns.reduce((sum, a) => sum + a.price, 0) + (item.shippingMethod?.price || 0),
          transaction_hash: null,
          wallet_address: selectedPaymentMethod === "usdt" ? "USDT TRC20" : selectedBank?.region || "Bank Transfer",
          message: values.message || null,
          status: "pending",
        });

        if (error) throw error;
      }

      setStep("confirmation");
      toast.success("Order submitted successfully!", {
        description: "Please complete your payment and upload proof.",
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    clearCart();
    navigate("/");
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <>
        <Helmet>
          <title>Checkout - PawfectMatch</title>
        </Helmet>
        <Navbar />
        <main className="min-h-screen bg-background pt-24 pb-16">
          <div className="container max-w-4xl mx-auto px-4">
            <Card className="text-center py-16">
              <CardContent>
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Add some adorable pets to get started!
                </p>
                <Button asChild className="rounded-full">
                  <Link to="/pets">Browse Pets</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - PawfectMatch</title>
        <meta name="description" content="Complete your pet adoption checkout securely." />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {["Details", "Payment", "Confirmation"].map((label, idx) => {
              const stepNames = ["details", "payment", "confirmation"];
              const currentIdx = stepNames.indexOf(step);
              const isActive = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    } ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`hidden sm:block text-sm ${
                      isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  {idx < 2 && (
                    <div
                      className={`w-12 h-0.5 ${
                        idx < currentIdx ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {step === "details" && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.petId}
                          className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl"
                        >
                          {item.petImage && (
                            <img
                              src={item.petImage}
                              alt={item.petName}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold">{item.petName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.isReservation ? "30% Reservation Deposit" : "Full Adoption"}
                            </p>
                            {item.shippingMethod && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Truck className="h-3 w-3" />
                                {item.shippingMethod.name}
                              </p>
                            )}
                            {item.addOns.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {item.addOns.map((addOn) => (
                                  <span
                                    key={addOn.id}
                                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                                  >
                                    {addOn.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatPrice(
                                item.isReservation && item.reservationDeposit
                                  ? item.reservationDeposit
                                  : item.basePrice
                              )}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive mt-1"
                              onClick={() => removeFromCart(item.petId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Your Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleDetailsSubmit)}
                          className="space-y-4"
                        >
                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="john@example.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+1 (555) 123-4567" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Address *</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="123 Main St, Apt 4B, City, State, ZIP"
                                    rows={2}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Separator className="my-6" />

                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  Payment Method *
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid gap-3 mt-2"
                                  >
                                    <Label
                                      htmlFor="usdt"
                                      className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                                        field.value === "usdt"
                                          ? "border-primary bg-primary/5"
                                          : "hover:border-primary/50"
                                      }`}
                                    >
                                      <RadioGroupItem value="usdt" id="usdt" />
                                      <Wallet className="h-5 w-5 text-primary" />
                                      <div className="flex-1">
                                        <p className="font-medium">USDT (Tether)</p>
                                        <p className="text-sm text-muted-foreground">
                                          TRC20 Network - Fast & Low Fees
                                        </p>
                                      </div>
                                    </Label>

                                    {bankDetails.map((bank) => (
                                      <Label
                                        key={bank.id}
                                        htmlFor={`bank_${bank.id}`}
                                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                                          field.value === `bank_${bank.id}`
                                            ? "border-primary bg-primary/5"
                                            : "hover:border-primary/50"
                                        }`}
                                      >
                                        <RadioGroupItem
                                          value={`bank_${bank.id}`}
                                          id={`bank_${bank.id}`}
                                        />
                                        <Building2 className="h-5 w-5 text-primary" />
                                        <div className="flex-1">
                                          <p className="font-medium">{bank.region}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {bank.subtitle} ({bank.currency})
                                          </p>
                                        </div>
                                      </Label>
                                    ))}

                                    {isPayPalEnabled && (
                                      <Label
                                        htmlFor="paypal"
                                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                                          field.value === "paypal"
                                            ? "border-primary bg-primary/5"
                                            : "hover:border-primary/50"
                                        }`}
                                      >
                                        <RadioGroupItem value="paypal" id="paypal" />
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        <div className="flex-1">
                                          <p className="font-medium">PayPal</p>
                                          <p className="text-sm text-muted-foreground">
                                            Pay securely with PayPal
                                          </p>
                                        </div>
                                      </Label>
                                    )}

                                    {isStripeEnabled && (
                                      <Label
                                        htmlFor="stripe"
                                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                                          field.value === "stripe"
                                            ? "border-primary bg-primary/5"
                                            : "hover:border-primary/50"
                                        }`}
                                      >
                                        <RadioGroupItem value="stripe" id="stripe" />
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        <div className="flex-1">
                                          <p className="font-medium">Pay with Card (Stripe)</p>
                                          <p className="text-sm text-muted-foreground">
                                            Credit/Debit Card - Visa, Mastercard, etc.
                                          </p>
                                        </div>
                                      </Label>
                                    )}

                                    {isCheckoutComEnabled && (
                                      <Label
                                        htmlFor="checkoutcom"
                                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                                          field.value === "checkoutcom"
                                            ? "border-primary bg-primary/5"
                                            : "hover:border-primary/50"
                                        }`}
                                      >
                                        <RadioGroupItem value="checkoutcom" id="checkoutcom" />
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        <div className="flex-1">
                                          <p className="font-medium">Credit / Debit Card</p>
                                          <p className="text-sm text-muted-foreground">
                                            Visa, MasterCard, American Express
                                          </p>
                                        </div>
                                      </Label>
                                    )}
                                  </RadioGroup>
                                </FormControl>
                                <PaymentSuggestionDialog defaultEmail={form.watch("email")} />
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Any special requests or notes..."
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="acceptTerms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 bg-muted/30">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    I agree to the{" "}
                                    <Link
                                      to="/terms"
                                      className="text-primary underline hover:text-primary/80"
                                      target="_blank"
                                    >
                                      Terms & Conditions
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                      to="/privacy"
                                      className="text-primary underline hover:text-primary/80"
                                      target="_blank"
                                    >
                                      Privacy Policy
                                    </Link>
                                  </FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="w-full rounded-full" size="lg">
                            Continue to Payment
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </>
              )}

              {step === "payment" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedPaymentMethod === "usdt" ? (
                        <Wallet className="h-5 w-5" />
                      ) : selectedPaymentMethod === "paypal" ? (
                        <CreditCard className="h-5 w-5" />
                      ) : (
                        <Building2 className="h-5 w-5" />
                      )}
                      Payment Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-primary/10 rounded-xl text-center">
                      <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
                      <p className="font-display text-4xl font-bold text-primary">
                        {formatPrice(subtotal)}
                      </p>
                    </div>

                    {selectedPaymentMethod === "usdt" ? (
                      <div className="space-y-4">
                        <div className="p-4 border rounded-xl space-y-3">
                          <CopyableDetail label="Network" value={usdtDetails.network} />
                          <CopyableDetail
                            label="Wallet Address"
                            value={usdtDetails.walletAddress}
                          />
                        </div>
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <p className="text-sm text-destructive font-medium">
                            ⚠️ {usdtDetails.note}
                          </p>
                        </div>
                      </div>
                    ) : selectedPaymentMethod === "paypal" && isPayPalEnabled ? (
                      <div className="space-y-4">
                        <div className="p-4 border rounded-xl space-y-4">
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="font-medium">Pay with PayPal</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Click the PayPal button below to complete your payment securely. 
                            You can pay with your PayPal account or a credit/debit card.
                          </p>
                          
                          <PayPalCheckout
                            clientId={paypalSettings?.clientId || ""}
                            amount={subtotal}
                            currency={paypalSettings?.currency || "USD"}
                            mode={paypalSettings?.mode || "sandbox"}
                            onSuccess={async (orderId, payerId) => {
                              // Create guest payment record with PayPal order ID
                              setIsSubmitting(true);
                              try {
                                const values = form.getValues();
                                for (const item of items) {
                                  const { error } = await supabase.from("guest_payments").insert({
                                    pet_id: item.petId,
                                    guest_name: values.name,
                                    guest_email: values.email,
                                    guest_phone: values.phone || null,
                                    guest_address: values.address || null,
                                    amount: item.isReservation && item.reservationDeposit
                                      ? item.reservationDeposit
                                      : item.basePrice + item.addOns.reduce((sum, a) => sum + a.price, 0) + (item.shippingMethod?.price || 0),
                                    transaction_hash: orderId,
                                    wallet_address: `PayPal (Payer: ${payerId})`,
                                    message: values.message || null,
                                    status: "completed",
                                  });

                                  if (error) throw error;
                                }

                                setStep("confirmation");
                                toast.success("Payment completed successfully!", {
                                  description: "Your PayPal payment has been processed.",
                                });
                              } catch (error) {
                                console.error("Error saving PayPal payment:", error);
                                toast.error("Payment received but failed to save order. Please contact support.");
                              } finally {
                                setIsSubmitting(false);
                              }
                            }}
                            onError={(error) => {
                              console.error("PayPal payment error:", error);
                            }}
                            onCancel={() => {
                              console.log("PayPal payment cancelled");
                            }}
                          />
                        </div>
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-sm text-primary font-medium">
                            💡 PayPal accepts credit/debit cards and PayPal balance. You don't need a PayPal account.
                          </p>
                        </div>
                      </div>
                    ) : selectedPaymentMethod === "stripe" && isStripeEnabled ? (
                      <div className="space-y-4">
                        <div className="p-4 border rounded-xl space-y-4">
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="font-medium">Pay with Card</span>
                          </div>
                          
                          <StripeCheckout
                            publishableKey={stripeSettings?.publishableKey || ""}
                            amount={subtotal}
                            currency={stripeSettings?.currency || "USD"}
                            metadata={{
                              customer_email: form.getValues("email"),
                              customer_name: form.getValues("name"),
                            }}
                            onSuccess={async (paymentIntentId) => {
                              // Create guest payment record with Stripe payment intent ID
                              setIsSubmitting(true);
                              try {
                                const values = form.getValues();
                                for (const item of items) {
                                  const { error } = await supabase.from("guest_payments").insert({
                                    pet_id: item.petId,
                                    guest_name: values.name,
                                    guest_email: values.email,
                                    guest_phone: values.phone || null,
                                    guest_address: values.address || null,
                                    amount: item.isReservation && item.reservationDeposit
                                      ? item.reservationDeposit
                                      : item.basePrice + item.addOns.reduce((sum, a) => sum + a.price, 0) + (item.shippingMethod?.price || 0),
                                    transaction_hash: paymentIntentId,
                                    wallet_address: "Stripe Card Payment",
                                    message: values.message || null,
                                    status: "completed",
                                  });

                                  if (error) throw error;
                                }

                                setStep("confirmation");
                                toast.success("Payment completed successfully!", {
                                  description: "Your card payment has been processed.",
                                });
                              } catch (error) {
                                console.error("Error saving Stripe payment:", error);
                                toast.error("Payment received but failed to save order. Please contact support.");
                              } finally {
                                setIsSubmitting(false);
                              }
                            }}
                            onError={(error) => {
                              console.error("Stripe payment error:", error);
                            }}
                          />
                        </div>
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-sm text-primary font-medium">
                            💳 Secure card payments powered by Stripe. We accept Visa, Mastercard, and more.
                          </p>
                        </div>
                      </div>
                    ) : selectedPaymentMethod === "checkoutcom" && isCheckoutComEnabled ? (
                      <div className="space-y-4">
                        <div className="p-4 border rounded-xl space-y-4">
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="font-medium">Pay with Credit/Debit Card</span>
                          </div>
                          
                          <CheckoutComCheckout
                            publicKey={checkoutcomSettings?.publicKey || ""}
                            amount={subtotal}
                            currency={checkoutcomSettings?.currency || "USD"}
                            applePayEnabled={checkoutcomSettings?.applePayEnabled ?? true}
                            googlePayEnabled={checkoutcomSettings?.googlePayEnabled ?? true}
                            metadata={{
                              customer_email: form.getValues("email"),
                              customer_name: form.getValues("name"),
                            }}
                            onSuccess={async (paymentId) => {
                              setIsSubmitting(true);
                              try {
                                const values = form.getValues();
                                for (const item of items) {
                                  const { error } = await supabase.from("guest_payments").insert({
                                    pet_id: item.petId,
                                    guest_name: values.name,
                                    guest_email: values.email,
                                    guest_phone: values.phone || null,
                                    guest_address: values.address || null,
                                    amount: item.isReservation && item.reservationDeposit
                                      ? item.reservationDeposit
                                      : item.basePrice + item.addOns.reduce((sum, a) => sum + a.price, 0) + (item.shippingMethod?.price || 0),
                                    transaction_hash: paymentId,
                                    wallet_address: "Checkout.com Card Payment",
                                    message: values.message || null,
                                    status: "completed",
                                  });

                                  if (error) throw error;
                                }

                                setStep("confirmation");
                                toast.success("Payment completed successfully!", {
                                  description: "Your card payment has been processed.",
                                });
                              } catch (error) {
                                console.error("Error saving Checkout.com payment:", error);
                                toast.error("Payment received but failed to save order. Please contact support.");
                              } finally {
                                setIsSubmitting(false);
                              }
                            }}
                            onError={(error) => {
                              console.error("Checkout.com payment error:", error);
                            }}
                          />
                        </div>
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-sm text-primary font-medium">
                            💳 Secure card payments. We accept Visa, Mastercard, and American Express.
                          </p>
                        </div>
                      </div>
                    ) : selectedBank ? (
                      <div className="p-4 border rounded-xl space-y-3">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                          <Building2 className="h-5 w-5 text-primary" />
                          <span className="font-medium">{selectedBank.region}</span>
                        </div>
                        {selectedBank.details.map((detail, idx) => (
                          <CopyableDetail
                            key={idx}
                            label={detail.label}
                            value={detail.value}
                          />
                        ))}
                      </div>
                    ) : null}

                    <div className="p-4 bg-muted rounded-xl space-y-2">
                      <div className="flex items-start gap-2">
                        <Shield className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Secure Payment</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedPaymentMethod === "paypal" || selectedPaymentMethod === "stripe" || selectedPaymentMethod === "checkoutcom"
                              ? "After completing your payment, your order will be confirmed automatically."
                              : "After completing your transfer, please upload proof of payment. Payments are reviewed and confirmed within 24-48 business hours."
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 rounded-full"
                        onClick={() => setStep("details")}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      {selectedPaymentMethod !== "paypal" && selectedPaymentMethod !== "stripe" && selectedPaymentMethod !== "checkoutcom" && (
                        <Button
                          type="button"
                          className="flex-1 rounded-full"
                          onClick={handlePaymentConfirm}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "I've Made the Payment"
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === "confirmation" && (
                <Card className="text-center py-8">
                  <CardContent className="space-y-6">
                    <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-display text-2xl font-bold">
                        {selectedPaymentMethod === "paypal" 
                          ? "Payment Completed Successfully!" 
                          : "Order Submitted Successfully!"}
                      </h2>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        {selectedPaymentMethod === "paypal"
                          ? "Thank you for your order. Your PayPal payment has been processed and your order is now confirmed."
                          : "Thank you for your order. Please complete your payment transfer and upload proof of payment to expedite verification."}
                      </p>
                    </div>

                    <div className="p-4 bg-muted rounded-xl text-left max-w-sm mx-auto space-y-2">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Email:</span>{" "}
                        <strong>{form.getValues("email")}</strong>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Total Amount:</span>{" "}
                        <strong>{formatPrice(subtotal)}</strong>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {selectedPaymentMethod !== "paypal" && (
                        <Button asChild className="rounded-full">
                          <Link to={`/payment-methods${selectedBank ? `?bank=${selectedBank.id}` : selectedPaymentMethod === "usdt" ? "?bank=usdt" : ""}`}>Upload Proof of Payment</Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={handleFinish}
                      >
                        Back to Home
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {step !== "confirmation" && (
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => {
                      const itemPrice = item.isReservation && item.reservationDeposit
                        ? item.reservationDeposit
                        : item.basePrice;
                      const addOnsPrice = item.addOns.reduce((sum, a) => sum + a.price, 0);
                      const shippingPrice = item.shippingMethod?.price || 0;

                      return (
                        <div key={item.petId} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{item.petName}</span>
                            <span>{formatPrice(itemPrice)}</span>
                          </div>
                          {addOnsPrice > 0 && (
                            <div className="flex justify-between text-sm text-muted-foreground pl-2">
                              <span>Add-ons</span>
                              <span>+{formatPrice(addOnsPrice)}</span>
                            </div>
                          )}
                          {shippingPrice > 0 && (
                            <div className="flex justify-between text-sm text-muted-foreground pl-2">
                              <span>{item.shippingMethod?.name}</span>
                              <span>+{formatPrice(shippingPrice)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(subtotal)}</span>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      {currency === "CAD" && "Prices shown in CAD"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
