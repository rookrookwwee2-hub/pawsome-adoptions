import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Copy, QrCode, CheckCircle2, Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WALLET_ADDRESS = "TYourTRC20WalletAddressHere"; // Replace with actual TRC20 wallet

const guestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  phone: z.string().optional(),
  address: z.string().optional(),
  transactionHash: z.string().optional(),
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
      transactionHash: "",
      message: "",
    },
  });

  const copyWallet = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    toast.success("Wallet address copied!");
  };

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
        transaction_hash: values.transactionHash || null,
        wallet_address: WALLET_ADDRESS,
        message: values.message || null,
        status: "pending",
      });

      if (error) throw error;

      setStep("confirmation");
      toast.success("Payment submitted!", {
        description: "We'll verify your payment and contact you soon.",
      });
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to submit payment. Please try again.");
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {step === "confirmation"
              ? "Payment Submitted!"
              : `Adopt ${petName}`}
          </DialogTitle>
          <DialogDescription>
            {step === "info" && "Enter your details to proceed with adoption."}
            {step === "payment" && "Send USDT to complete your adoption."}
            {step === "confirmation" &&
              "Your payment is being reviewed by our team."}
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
                Continue to Payment
              </Button>
            </form>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-xl text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Amount to Pay
                </p>
                <p className="font-display text-3xl font-bold text-primary">
                  ${amount} USDT
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  TRC20 Network (Tron)
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Send USDT to this address:</p>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="flex-1 text-xs break-all">
                    {WALLET_ADDRESS}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={copyWallet}
                    className="shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="p-4 bg-background border rounded-xl">
                  <QrCode className="w-32 h-32 text-foreground" />
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Scan QR Code
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="transactionHash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Hash (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your transaction hash for faster verification"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    "I've Sent Payment"
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
                  Thank you for your adoption request! We'll verify your USDT
                  payment and contact you at{" "}
                  <strong>{form.getValues("email")}</strong> within 24-48 hours.
                </p>
              </div>
              <Button
                type="button"
                className="w-full rounded-full"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestCheckout;
