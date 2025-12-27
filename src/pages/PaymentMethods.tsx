import { Helmet } from "react-helmet-async";
import { Building2, Clock, AlertTriangle, Upload } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import ProofOfPaymentUpload from "@/components/payment/ProofOfPaymentUpload";

const PaymentMethods = () => {
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [searchParams] = useSearchParams();
  const selectedBank = searchParams.get("bank");
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

  // Only show the selected bank from URL param - require a selection
  const displayedBank = useMemo(() => {
    if (!selectedBank) return null;
    return bankDetails.find(bank => bank.id === selectedBank) || null;
  }, [selectedBank]);

  return (
    <>
      <Helmet>
        <title>Payment Methods | PawHaven</title>
        <meta
          name="description"
          content="Secure payment options for pet adoption. Bank transfer details for UK, USA, and Eurozone payments."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-16">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-12 animate-fade-up opacity-0">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                {displayedBank ? "Complete Your Payment" : "Payment Methods"}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {displayedBank 
                  ? "Use the bank details below to complete your adoption payment securely."
                  : "Please select a payment method during checkout to view the bank details."}
              </p>
            </div>

            <Alert className="mb-8 animate-fade-up opacity-0 stagger-1">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Processing Time:</strong> All payments are manually reviewed and typically confirmed within 24–48 business hours. You will receive an email confirmation once your payment has been verified.
              </AlertDescription>
            </Alert>

            {displayedBank && (
              <div className="space-y-6 animate-fade-up opacity-0 stagger-2">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{displayedBank.region}</CardTitle>
                        <CardDescription>{displayedBank.subtitle} • {displayedBank.currency}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {displayedBank.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-muted-foreground text-sm">{detail.label}</span>
                          <span className="font-medium font-mono text-sm sm:text-right">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Separator className="my-12" />

            {/* Proof of Payment Section */}
            <div className="animate-fade-up opacity-0 stagger-3">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  Submit Proof of Payment
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  After completing your bank transfer, please upload a screenshot or photo of your payment confirmation to expedite the verification process.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg inline-block">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-2">Ready to upload your payment proof?</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Accepted formats: JPG, PNG, PDF (Max 10MB)
                      </p>
                      <Button 
                        size="lg" 
                        className="rounded-full"
                        onClick={() => setShowProofUpload(true)}
                      >
                        Upload Proof of Payment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert variant="destructive" className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Legal Notice:</strong> Submitting false, manipulated, or fraudulent payment confirmations is strictly prohibited and may result in immediate account suspension, legal action, and reporting to relevant authorities.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </main>

        <Footer />

        <ProofOfPaymentUpload 
          open={showProofUpload} 
          onOpenChange={setShowProofUpload} 
        />
      </div>
    </>
  );
};

export default PaymentMethods;
