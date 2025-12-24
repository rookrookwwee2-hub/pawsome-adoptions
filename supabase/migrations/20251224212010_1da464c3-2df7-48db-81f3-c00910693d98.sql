-- Create payment_proofs table for tracking bank transfer proof submissions
CREATE TABLE public.payment_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  guest_name TEXT,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  transaction_reference TEXT NOT NULL,
  transfer_date DATE NOT NULL,
  amount_sent NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own payment proofs"
ON public.payment_proofs
FOR SELECT
USING (auth.uid() = user_id OR guest_email IS NOT NULL);

CREATE POLICY "Users can create payment proofs"
ON public.payment_proofs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all payment proofs"
ON public.payment_proofs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage payment proofs"
ON public.payment_proofs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_payment_proofs_updated_at
BEFORE UPDATE ON public.payment_proofs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create admin_notifications table for admin alerts
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can see notifications
CREATE POLICY "Admins can view notifications"
ON public.admin_notifications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage notifications"
ON public.admin_notifications
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can create notifications (for system triggers)
CREATE POLICY "System can create notifications"
ON public.admin_notifications
FOR INSERT
WITH CHECK (true);

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false);

-- Storage policies for payment proofs bucket
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Admins can view payment proof files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-proofs' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete payment proof files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'payment-proofs' AND has_role(auth.uid(), 'admin'::app_role));

-- Add delivery_type column to pets table
ALTER TABLE public.pets 
ADD COLUMN delivery_type TEXT DEFAULT 'pickup_or_delivery',
ADD COLUMN delivery_notes TEXT;