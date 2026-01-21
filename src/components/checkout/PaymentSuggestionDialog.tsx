import { useState } from "react";
import { MessageSquarePlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label as FormLabel } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentSuggestionDialogProps {
  defaultEmail?: string;
}

const PaymentSuggestionDialog = ({ defaultEmail = "" }: PaymentSuggestionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [suggestionEmail, setSuggestionEmail] = useState(defaultEmail);
  const [suggestedMethod, setSuggestedMethod] = useState("");
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!suggestionEmail.trim() || !suggestedMethod.trim()) {
      toast.error("Please provide your email and the payment method you'd like to suggest.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("payment_method_suggestions")
        .insert({
          email: suggestionEmail.trim(),
          suggested_method: suggestedMethod.trim(),
          message: suggestionMessage.trim() || null,
        });

      if (error) throw error;

      // Create admin notification
      await supabase.from("admin_notifications").insert({
        type: "payment_suggestion",
        title: "New Payment Method Suggestion",
        message: `${suggestionEmail.trim()} suggested: ${suggestedMethod.trim()}`,
        reference_type: "payment_method_suggestion",
      });

      toast.success("Suggestion submitted! We'll review and get in touch.");

      // Reset form and close dialog
      setSuggestionEmail(defaultEmail);
      setSuggestedMethod("");
      setSuggestionMessage("");
      setOpen(false);
    } catch (error: any) {
      console.error("Error submitting suggestion:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:border-primary/50"
        >
          <MessageSquarePlus className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="font-medium">Suggest a Payment Method</p>
            <p className="text-sm text-muted-foreground">
              Don't see your preferred option?
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            Suggest a Payment Method
          </DialogTitle>
          <DialogDescription>
            Don't see your preferred payment method? Let us know and we'll do our best to accommodate you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <FormLabel htmlFor="suggestion-email">Your Email *</FormLabel>
            <Input
              id="suggestion-email"
              type="email"
              placeholder="your@email.com"
              value={suggestionEmail}
              onChange={(e) => setSuggestionEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <FormLabel htmlFor="suggested-method">Payment Method *</FormLabel>
            <Input
              id="suggested-method"
              type="text"
              placeholder="e.g., PayPal, Zelle, Cash App..."
              value={suggestedMethod}
              onChange={(e) => setSuggestedMethod(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <FormLabel htmlFor="suggestion-message">Additional Details (Optional)</FormLabel>
            <Textarea
              id="suggestion-message"
              placeholder="Any additional information..."
              value={suggestionMessage}
              onChange={(e) => setSuggestionMessage(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full" disabled={isSubmitting}>
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuggestionDialog;
