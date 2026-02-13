import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload, FileText, X, Lock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getOrderContext, OrderContext } from "@/lib/orderContext";

const proofSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().optional(),
  guestAddress: z.string().optional(),
  transactionReference: z.string().min(3, "Transaction reference is required"),
  transferDate: z.date({ required_error: "Transfer date is required" }),
  amountSent: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  shippingMethod: z.string().optional(),
  clientNotes: z.string().optional(),
});

type ProofFormData = z.infer<typeof proofSchema>;

interface ProofOfPaymentUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petId?: string;
  petName?: string;
}

const ProofOfPaymentUpload = ({ open, onOpenChange, petId, petName }: ProofOfPaymentUploadProps) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [orderCtx, setOrderCtx] = useState<OrderContext | null>(null);

  const hasOrderContext = !!orderCtx;

  const form = useForm<ProofFormData>({
    resolver: zodResolver(proofSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      guestAddress: "",
      transactionReference: "",
      amountSent: "",
      currency: "USD",
      paymentMethod: "",
      shippingMethod: "",
      clientNotes: "",
    },
  });

  // Load order context and pre-fill form when dialog opens
  useEffect(() => {
    if (open) {
      const ctx = getOrderContext();
      setOrderCtx(ctx);
      if (ctx) {
        form.reset({
          guestName: ctx.customerName,
          guestEmail: ctx.customerEmail,
          guestPhone: ctx.customerPhone || "",
          guestAddress: ctx.customerAddress || "",
          transactionReference: "",
          amountSent: ctx.totalAmount.toFixed(2),
          currency: ctx.currency || "USD",
          paymentMethod: ctx.paymentMethodLabel || ctx.paymentMethod || "",
          shippingMethod: ctx.shippingMethod || "",
          clientNotes: ctx.customerMessage || "",
        });
      }
    }
  }, [open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type", { description: "Please upload a JPG, PNG, or PDF file." });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum file size is 10MB." });
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => setFile(null);

  const onSubmit = async (data: ProofFormData) => {
    if (!file) {
      toast.error("Please upload a file", { description: "A proof of payment file is required." });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("payment_proofs").insert({
        user_id: user?.id || null,
        guest_name: data.guestName,
        guest_email: data.guestEmail,
        guest_phone: data.guestPhone || null,
        guest_address: data.guestAddress || null,
        pet_id: orderCtx?.petId || petId || null,
        transaction_reference: data.transactionReference,
        transfer_date: format(data.transferDate, "yyyy-MM-dd"),
        amount_sent: parseFloat(data.amountSent),
        currency: data.currency,
        payment_method: data.paymentMethod,
        shipping_method: data.shippingMethod || null,
        shipping_cost: orderCtx?.shippingCost ?? null,
        client_notes: data.clientNotes || null,
        file_url: filePath,
        file_name: file.name,
        status: "pending",
      });

      if (insertError) throw insertError;

      await supabase.from("admin_notifications").insert({
        type: "payment_proof",
        title: "New Payment Proof Submitted",
        message: `${data.guestName} submitted a payment proof for ${data.currency} ${data.amountSent}${orderCtx?.petName || petName ? ` for ${orderCtx?.petName || petName}` : ""}`,
        reference_type: "payment_proof",
      });

      setStep("success");
      toast.success("Proof submitted successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Submission failed", { description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setFile(null);
    setOrderCtx(null);
    form.reset();
    onOpenChange(false);
  };

  const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1">
      <Label className="text-sm text-muted-foreground flex items-center gap-1">
        <Lock className="h-3 w-3" /> {label}
      </Label>
      <div className="px-3 py-2 bg-muted rounded-md text-sm font-medium border">
        {value || "—"}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Submit Proof of Payment</DialogTitle>
              <DialogDescription>
                Upload your payment confirmation to verify your transfer.
                {(orderCtx?.petName || petName) && (
                  <span className="block mt-1 font-medium text-foreground">
                    For: {orderCtx?.petName || petName}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {/* Order Summary (auto-filled from checkout) */}
            {hasOrderContext && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-4 space-y-3">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                    📦 Order Summary (Auto-filled)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Pet:</span>
                      <span className="ml-1 font-medium">{orderCtx.petName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-1 font-medium capitalize">{orderCtx.petType || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shipping:</span>
                      <span className="ml-1 font-medium">{orderCtx.shippingMethod || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shipping Cost:</span>
                      <span className="ml-1 font-medium">${orderCtx.shippingCost.toFixed(2)}</span>
                    </div>
                    {orderCtx.addOns.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Add-ons:</span>
                        <span className="ml-1 font-medium">
                          {orderCtx.addOns.map(a => a.name).join(", ")} (+${orderCtx.addOnsTotal.toFixed(2)})
                        </span>
                      </div>
                    )}
                    <div className="col-span-2 pt-1 border-t">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="ml-1 font-bold text-primary">${orderCtx.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Auto-filled customer fields (read-only when order context exists) */}
                {hasOrderContext ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground">👤 Customer Details (from checkout)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <ReadOnlyField label="Full Name" value={orderCtx.customerName} />
                      <ReadOnlyField label="Email" value={orderCtx.customerEmail} />
                      <ReadOnlyField label="Phone" value={orderCtx.customerPhone} />
                      <ReadOnlyField label="Payment Method" value={orderCtx.paymentMethodLabel} />
                    </div>
                    <ReadOnlyField label="Delivery Address" value={orderCtx.customerAddress} />
                    <ReadOnlyField label="Amount to Send" value={`${orderCtx.currency} ${orderCtx.totalAmount.toFixed(2)}`} />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="guestName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guestEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="guestPhone"
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
                        name="shippingMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ground">Ground Transport</SelectItem>
                                <SelectItem value="air_cargo">Air Cargo</SelectItem>
                                <SelectItem value="flight_nanny">Flight Nanny</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="guestAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, Apt 4B, City, State, ZIP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="uk_bacs">UK BACS/Faster Payments</SelectItem>
                                <SelectItem value="usa_ach">USA ACH</SelectItem>
                                <SelectItem value="usa_wire">USA Wire Transfer</SelectItem>
                                <SelectItem value="sepa">SEPA Transfer</SelectItem>
                                <SelectItem value="usdt_trc20">USDT TRC20</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="amountSent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount Sent</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <Separator />

                <h4 className="text-sm font-semibold text-muted-foreground">✏️ Payment Verification (fill these)</h4>

                <FormField
                  control={form.control}
                  name="transactionReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Reference *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., TRX123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="transferDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Transfer Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!hasOrderContext && (
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="clientNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional notes..." rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Proof Document *</Label>
                  {file ? (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg min-w-0">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <span className="flex-1 text-sm truncate min-w-0 max-w-[200px]">{file.name}</span>
                      <Button type="button" variant="ghost" size="icon" onClick={removeFile} className="shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload JPG, PNG, or PDF (max 10MB)
                      </p>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="proof-file"
                      />
                      <Button type="button" variant="outline" asChild>
                        <label htmlFor="proof-file" className="cursor-pointer">
                          Choose File
                        </label>
                      </Button>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? "Submitting..." : "Submit Proof of Payment"}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="mb-2">Proof Submitted Successfully</DialogTitle>
            <DialogDescription className="mb-6">
              Your payment proof has been submitted and is under review. You will receive an email confirmation within 24-48 business hours.
            </DialogDescription>
            <Button onClick={handleClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProofOfPaymentUpload;
