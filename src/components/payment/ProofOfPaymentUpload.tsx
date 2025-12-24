import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload, FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const proofSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email is required"),
  transactionReference: z.string().min(3, "Transaction reference is required"),
  transferDate: z.date({ required_error: "Transfer date is required" }),
  amountSent: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
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

  const form = useForm<ProofFormData>({
    resolver: zodResolver(proofSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      transactionReference: "",
      amountSent: "",
      currency: "USD",
      paymentMethod: "",
    },
  });

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
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create payment proof record
      const { error: insertError } = await supabase.from("payment_proofs").insert({
        user_id: user?.id || null,
        guest_name: data.guestName,
        guest_email: data.guestEmail,
        pet_id: petId || null,
        transaction_reference: data.transactionReference,
        transfer_date: format(data.transferDate, "yyyy-MM-dd"),
        amount_sent: parseFloat(data.amountSent),
        currency: data.currency,
        payment_method: data.paymentMethod,
        file_url: filePath,
        file_name: file.name,
        status: "pending",
      });

      if (insertError) throw insertError;

      // Create admin notification
      await supabase.from("admin_notifications").insert({
        type: "payment_proof",
        title: "New Payment Proof Submitted",
        message: `${data.guestName} submitted a payment proof for ${data.currency} ${data.amountSent}${petName ? ` for ${petName}` : ""}`,
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
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Submit Proof of Payment</DialogTitle>
              <DialogDescription>
                Upload your payment confirmation to verify your bank transfer.
                {petName && <span className="block mt-1 font-medium text-foreground">For: {petName}</span>}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                <FormField
                  control={form.control}
                  name="transactionReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Reference</FormLabel>
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
                        <FormLabel>Transfer Date</FormLabel>
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Proof Document</Label>
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
