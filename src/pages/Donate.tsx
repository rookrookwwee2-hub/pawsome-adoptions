import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Upload, Loader2, CheckCircle, Building2, CreditCard, Copy, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import PetImageSection from "@/components/shared/PetImageSection";
import { useTranslation } from "react-i18next";

const donationSchema = z.object({
  donor_name: z.string().trim().min(2).max(100),
  donor_email: z.string().trim().email(),
  donor_phone: z.string().optional(),
  amount: z.number().positive(),
  donation_type: z.enum(["one-time", "monthly"]),
  message: z.string().max(500).optional(),
});

const fallbackBankDetails = [
  { id: "uk", region: "UK Local Bank Transfer", subtitle: "BACS / Faster Payments", currency: "GBP", details: [{ label: "Bank Name", value: "Barclays" }, { label: "Sort Code", value: "23-14-86" }, { label: "Account Number", value: "15870922" }, { label: "Beneficiary Name", value: "Kenneth Roberts" }] },
  { id: "usa", region: "USA Local Bank Transfer", subtitle: "ACH / Wire", currency: "USD", details: [{ label: "Bank Name", value: "Citibank" }, { label: "Bank Address", value: "111 Wall Street, New York, NY 10043, USA" }, { label: "Routing (ABA)", value: "031100209" }, { label: "Account Number", value: "70589140002133813" }, { label: "Account Type", value: "Checking" }, { label: "Beneficiary Name", value: "Kenneth Roberts" }] },
  { id: "eu", region: "Eurozone SEPA Bank Transfer", subtitle: "SEPA", currency: "EUR", details: [{ label: "Bank Name", value: "Banking Circle S.A." }, { label: "Bank Address", value: "2, Boulevard de la Foire, L-1528 Luxembourg" }, { label: "IBAN", value: "LU63 4080 0000 5965 4770" }, { label: "BIC (SWIFT)", value: "BCIRLULL" }, { label: "Beneficiary Name", value: "Kenneth Roberts" }] },
];

const Donate = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { bankSettings } = usePaymentSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [selectedBankId, setSelectedBankId] = useState<string>("uk");
  
  const bankDetails = bankSettings.length > 0 ? bankSettings : fallbackBankDetails;
  const selectedBank = bankDetails.find((b) => b.id === selectedBankId) || bankDetails[0];
  const [formData, setFormData] = useState({
    donor_name: "", donor_email: "", donor_phone: "", amount: "", donation_type: "one-time" as "one-time" | "monthly", message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t("donate.copied"), description: t("donate.copiedDesc", { label }) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: t("donate.fileTooLarge"), description: t("donate.fileTooLargeDesc"), variant: "destructive" });
        return;
      }
      setProofFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validation = donationSchema.safeParse({ ...formData, amount: parseFloat(formData.amount) || 0 });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    if (!proofFile) {
      toast({ title: t("donate.proofRequired"), description: t("donate.proofRequiredDesc"), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const fileExt = proofFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `donations/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("payment-proofs").upload(filePath, proofFile);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);
      const { error: insertError } = await supabase.from("donations").insert({
        donor_name: validation.data.donor_name, donor_email: validation.data.donor_email, donor_phone: formData.donor_phone || null,
        amount: validation.data.amount, donation_type: validation.data.donation_type, message: formData.message || null,
        proof_file_url: urlData.publicUrl, proof_file_name: proofFile.name, user_id: user?.id || null,
      });
      if (insertError) throw insertError;
      setIsSubmitted(true);
      toast({ title: t("donate.donationSuccess"), description: t("donate.donationSuccessDesc") });
    } catch (error) {
      console.error("Donation submission error:", error);
      toast({ title: t("donate.donationFailed"), description: t("donate.donationFailedDesc"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet><title>{t("donate.thankYou")}</title></Helmet>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-4">{t("donate.thankYou")}</h1>
              <p className="text-muted-foreground mb-6">{t("donate.thankYouDesc")}</p>
              <Button onClick={() => window.location.href = "/"}>{t("donate.returnHome")}</Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("donate.pageTitle")}</title>
        <meta name="description" content={t("donate.subtitle")} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t("donate.title")}</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">{t("donate.subtitle")}</p>
            </div>

            <PetImageSection variant="single" className="py-8" />

            <div className="grid md:grid-cols-2 gap-8">
              {/* Bank Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />{t("donate.bankTransferTitle")}</CardTitle>
                  <CardDescription>{t("donate.bankTransferDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Globe className="h-4 w-4" />{t("donate.selectRegion")}</Label>
                    <div className="grid gap-2">
                      {bankDetails.map((bank) => (
                        <button key={bank.id} type="button" onClick={() => setSelectedBankId(bank.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedBankId === bank.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                          <div className="flex items-center justify-between">
                            <div><p className="font-medium">{bank.region}</p><p className="text-xs text-muted-foreground">{bank.subtitle}</p></div>
                            <span className="text-sm font-medium text-muted-foreground">{bank.currency}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">{t("donate.transferTo", { currency: selectedBank.currency })}</p>
                    {selectedBank.details.map((detail) => (
                      <div key={detail.label} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1 min-w-0"><p className="text-xs text-muted-foreground">{detail.label}</p><p className="font-medium truncate">{detail.value}</p></div>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(detail.value, detail.label)} className="shrink-0"><Copy className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Donation Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />{t("donate.donationDetailsTitle")}</CardTitle>
                  <CardDescription>{t("donate.donationDetailsDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="donor_name">{t("donate.fullName")} *</Label>
                      <Input id="donor_name" value={formData.donor_name} onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })} placeholder={t("donate.namePlaceholder")} required />
                      {errors.donor_name && <p className="text-sm text-destructive mt-1">{errors.donor_name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="donor_email">{t("donate.email")} *</Label>
                      <Input id="donor_email" type="email" value={formData.donor_email} onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })} placeholder={t("donate.emailPlaceholder")} required />
                      {errors.donor_email && <p className="text-sm text-destructive mt-1">{errors.donor_email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="donor_phone">{t("donate.phone")}</Label>
                      <Input id="donor_phone" value={formData.donor_phone} onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })} placeholder={t("donate.phonePlaceholder")} />
                    </div>
                    <div>
                      <Label htmlFor="amount">{t("donate.amount")} *</Label>
                      <Input id="amount" type="number" min="1" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder={t("donate.amountPlaceholder")} required />
                      {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount}</p>}
                    </div>
                    <div>
                      <Label>{t("donate.donationType")}</Label>
                      <RadioGroup value={formData.donation_type} onValueChange={(value: "one-time" | "monthly") => setFormData({ ...formData, donation_type: value })} className="flex gap-4 mt-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="one-time" id="one-time" /><Label htmlFor="one-time" className="cursor-pointer">{t("donate.oneTime")}</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="monthly" id="monthly" /><Label htmlFor="monthly" className="cursor-pointer">{t("donate.monthly")}</Label></div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="message">{t("donate.messageLabel")}</Label>
                      <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t("donate.messagePlaceholder")} rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="proof">{t("donate.proofOfPayment")} *</Label>
                      <div className="mt-2">
                        <label htmlFor="proof" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">{proofFile ? proofFile.name : t("donate.clickToUpload")}</span>
                        </label>
                        <input id="proof" type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("donate.submitting")}</>) : (<><Heart className="mr-2 h-4 w-4" />{t("donate.submitDonation")}</>)}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Donate;
