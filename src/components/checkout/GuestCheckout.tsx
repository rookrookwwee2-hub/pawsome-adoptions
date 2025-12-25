import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Building2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const bankDetails = [
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

const CopyableDetail = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-2 text-sm group">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono font-medium">{value}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 rounded hover:bg-muted transition-colors"
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

const guestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  phone: z.string().optional(),
  address: z.string().optional(),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  message: z.string().max(500).optional(),
});

type GuestFormData = z.infer<typeof guestSchema>;

interface GuestCheckoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petId: string;
  petName: string;
  amount: number;
}

const GuestCheckout = ({
  open,
  onOpenChange,
  petId,
  petName,
  amount,
}: GuestCheckoutProps) => {
  const [step, setStep] = useState<"info" | "payment" | "confirmation">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentMethod: "",
      message: "",
    },
  });

  const selectedMethod = form.watch("paymentMethod");
  const selectedBank = bankDetails.find((b) => b.id === selectedMethod);

  const handleInfoSubmit = (data: GuestFormData) => {
    setStep("payment");
  };

  const handlePaymentSubmit = async () => {
    const values = form.getValues();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("guest_payments").insert({
        pet_id: petId,
        guest_name: values.name,
        guest_email: values.email,
        guest_phone: values.phone || null,
        guest_address: values.address || null,
        amount: amount,
        transaction_hash: null,
        wallet_address: selectedBank?.region || "Bank Transfer",
        message: values.message || null,
        status: "pending",
      });

      if (error) throw error;

      setStep("confirmation");
      toast.success("Adoption request submitted!", {
        description: "Please complete your bank transfer and upload proof of payment.",
      });
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("info");
      form.reset();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {step === "confirmation"
              ? "Request Submitted!"
              : `Adopt ${petName}`}
          </DialogTitle>
          <DialogDescription>
            {step === "info" && "Enter your details and select a payment method."}
            {step === "payment" && "Review bank details and complete your transfer."}
            {step === "confirmation" &&
              "Complete your bank transfer and upload proof of payment."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          {step === "info" && (
            <form
              onSubmit={form.handleSubmit(handleInfoSubmit)}
              className="space-y-4"
            >
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

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your payment region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bankDetails.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id}>
                            {bank.region} ({bank.currency})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        placeholder="Tell us why you'd like to adopt..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full rounded-full">
                Continue to Payment Details
              </Button>
            </form>
          )}

          {step === "payment" && selectedBank && (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-xl text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Amount to Pay
                </p>
                <p className="font-display text-3xl font-bold text-primary">
                  ${amount} {selectedBank.currency}
                </p>
              </div>

              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">{selectedBank.region}</span>
                </div>
                {selectedBank.details.map((detail, idx) => (
                  <CopyableDetail key={idx} label={detail.label} value={detail.value} />
                ))}
              </div>

              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-center">
                  <strong>Important:</strong> Payments are manually reviewed and typically confirmed within 24–48 business hours.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() => setStep("info")}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-full"
                  onClick={handlePaymentSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "confirmation" && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Thank you for your adoption request! Please complete your bank transfer using the details provided.
                </p>
                <p className="text-sm text-muted-foreground">
                  After making the transfer, please{" "}
                  <Link to="/payment-methods" className="text-primary underline" onClick={handleClose}>
                    upload your proof of payment
                  </Link>{" "}
                  to expedite verification.
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll contact you at <strong>{form.getValues("email")}</strong> within 24-48 hours.
                </p>
              </div>
              <Button
                type="button"
                className="w-full rounded-full"
                asChild
              >
                <Link to={`/payment-methods?bank=${encodeURIComponent(selectedMethod)}`} onClick={handleClose}>
                  Upload Proof of Payment
                </Link>
              </Button>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestCheckout;
