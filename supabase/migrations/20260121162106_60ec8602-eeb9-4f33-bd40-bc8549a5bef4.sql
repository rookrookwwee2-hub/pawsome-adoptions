-- Create table for payment method suggestions
CREATE TABLE public.payment_method_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  suggested_method TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_method_suggestions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a suggestion
CREATE POLICY "Anyone can submit payment suggestions"
ON public.payment_method_suggestions
FOR INSERT
WITH CHECK (true);

-- Admins can view and manage all suggestions
CREATE POLICY "Admins can manage payment suggestions"
ON public.payment_method_suggestions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_payment_method_suggestions_updated_at
BEFORE UPDATE ON public.payment_method_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();