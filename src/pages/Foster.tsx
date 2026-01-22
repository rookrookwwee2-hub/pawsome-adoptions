import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Loader2, CheckCircle, Heart, Users, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import PetImageSection from "@/components/shared/PetImageSection";

const fosterSchema = z.object({
  applicant_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  applicant_email: z.string().trim().email("Please enter a valid email"),
  applicant_phone: z.string().trim().min(10, "Please enter a valid phone number"),
  address: z.string().trim().min(10, "Please provide your full address"),
  housing_type: z.string().min(1, "Please select your housing type"),
  availability: z.string().min(1, "Please select your availability"),
});

const Foster = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    address: "",
    housing_type: "",
    has_yard: false,
    has_other_pets: false,
    other_pets_details: "",
    has_children: false,
    children_ages: "",
    experience: "",
    availability: "",
    preferred_pet_types: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePetTypeChange = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferred_pet_types: checked
        ? [...prev.preferred_pet_types, type]
        : prev.preferred_pet_types.filter((t) => t !== type),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = fosterSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("foster_applications").insert({
        applicant_name: formData.applicant_name,
        applicant_email: formData.applicant_email,
        applicant_phone: formData.applicant_phone,
        address: formData.address,
        housing_type: formData.housing_type,
        has_yard: formData.has_yard,
        has_other_pets: formData.has_other_pets,
        other_pets_details: formData.other_pets_details || null,
        has_children: formData.has_children,
        children_ages: formData.children_ages || null,
        experience: formData.experience || null,
        availability: formData.availability,
        preferred_pet_types: formData.preferred_pet_types.length > 0 ? formData.preferred_pet_types : null,
        user_id: user?.id || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({ title: "Application Submitted!", description: "We'll review your application and contact you soon." });
    } catch (error) {
      console.error("Foster application error:", error);
      toast({ title: "Submission failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Application Submitted - Pawsfam</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Application Submitted!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your interest in fostering! Our team will review your application and contact you within 3-5 business days.
              </p>
              <Button onClick={() => window.location.href = "/"}>Return Home</Button>
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
        <title>Become a Foster - Help Pets Find Homes | Pawsfam</title>
        <meta name="description" content="Join Pawsfam's foster program and provide temporary homes for pets in need. Make a difference in an animal's life while we find their forever home." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <Home className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Become a Foster Parent</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fostering provides a temporary loving home for pets until they find their forever family. It's a rewarding way to help animals in need.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Heart className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Save Lives</h3>
                  <p className="text-sm text-muted-foreground">Help pets transition from shelters to loving homes</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Full Support</h3>
                  <p className="text-sm text-muted-foreground">We provide food, supplies, and veterinary care</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Flexible Terms</h3>
                  <p className="text-sm text-muted-foreground">Choose short-term or long-term fostering</p>
                </CardContent>
              </Card>
            </div>

            <PetImageSection variant="dual" className="py-8" />

            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle>Foster Application</CardTitle>
                <CardDescription>Tell us about yourself and your home environment</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="applicant_name">Full Name *</Label>
                        <Input
                          id="applicant_name"
                          value={formData.applicant_name}
                          onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                          required
                        />
                        {errors.applicant_name && <p className="text-sm text-destructive mt-1">{errors.applicant_name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="applicant_email">Email *</Label>
                        <Input
                          id="applicant_email"
                          type="email"
                          value={formData.applicant_email}
                          onChange={(e) => setFormData({ ...formData, applicant_email: e.target.value })}
                          required
                        />
                        {errors.applicant_email && <p className="text-sm text-destructive mt-1">{errors.applicant_email}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="applicant_phone">Phone *</Label>
                        <Input
                          id="applicant_phone"
                          value={formData.applicant_phone}
                          onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
                          required
                        />
                        {errors.applicant_phone && <p className="text-sm text-destructive mt-1">{errors.applicant_phone}</p>}
                      </div>
                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Full address"
                          required
                        />
                        {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Living Situation */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Living Situation</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Housing Type *</Label>
                        <Select
                          value={formData.housing_type}
                          onValueChange={(value) => setFormData({ ...formData, housing_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select housing type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.housing_type && <p className="text-sm text-destructive mt-1">{errors.housing_type}</p>}
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="has_yard"
                            checked={formData.has_yard}
                            onCheckedChange={(checked) => setFormData({ ...formData, has_yard: !!checked })}
                          />
                          <Label htmlFor="has_yard" className="cursor-pointer">I have a fenced yard</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_other_pets"
                          checked={formData.has_other_pets}
                          onCheckedChange={(checked) => setFormData({ ...formData, has_other_pets: !!checked })}
                        />
                        <Label htmlFor="has_other_pets" className="cursor-pointer">I have other pets</Label>
                      </div>
                      {formData.has_other_pets && (
                        <Textarea
                          placeholder="Please describe your other pets (type, age, temperament)"
                          value={formData.other_pets_details}
                          onChange={(e) => setFormData({ ...formData, other_pets_details: e.target.value })}
                          rows={2}
                        />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_children"
                          checked={formData.has_children}
                          onCheckedChange={(checked) => setFormData({ ...formData, has_children: !!checked })}
                        />
                        <Label htmlFor="has_children" className="cursor-pointer">I have children at home</Label>
                      </div>
                      {formData.has_children && (
                        <Input
                          placeholder="Ages of children"
                          value={formData.children_ages}
                          onChange={(e) => setFormData({ ...formData, children_ages: e.target.value })}
                        />
                      )}
                    </div>
                  </div>

                  {/* Experience & Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Experience & Preferences</h3>
                    <div>
                      <Label htmlFor="experience">Pet Experience</Label>
                      <Textarea
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="Tell us about your experience with pets..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Availability *</Label>
                      <RadioGroup
                        value={formData.availability}
                        onValueChange={(value) => setFormData({ ...formData, availability: value })}
                        className="flex flex-wrap gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="short-term" id="short-term" />
                          <Label htmlFor="short-term" className="cursor-pointer">Short-term (1-4 weeks)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="long-term" id="long-term" />
                          <Label htmlFor="long-term" className="cursor-pointer">Long-term (1+ months)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="both" />
                          <Label htmlFor="both" className="cursor-pointer">Either</Label>
                        </div>
                      </RadioGroup>
                      {errors.availability && <p className="text-sm text-destructive mt-1">{errors.availability}</p>}
                    </div>

                    <div>
                      <Label>Preferred Pet Types</Label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {["Dog", "Cat", "Bird", "Small Animal", "Other"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`pet-${type}`}
                              checked={formData.preferred_pet_types.includes(type.toLowerCase())}
                              onCheckedChange={(checked) => handlePetTypeChange(type.toLowerCase(), !!checked)}
                            />
                            <Label htmlFor={`pet-${type}`} className="cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Home className="mr-2 h-4 w-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Foster;
