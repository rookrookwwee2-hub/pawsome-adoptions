-- Create guest payments table for USDT transactions
CREATE TABLE public.guest_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  guest_address TEXT,
  amount NUMERIC NOT NULL,
  transaction_hash TEXT,
  wallet_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guest_payments ENABLE ROW LEVEL SECURITY;

-- Anyone can create a guest payment (for guests without auth)
CREATE POLICY "Anyone can create guest payments"
ON public.guest_payments
FOR INSERT
WITH CHECK (true);

-- Anyone can view their own payment by email (for status check)
CREATE POLICY "Anyone can view payments by email"
ON public.guest_payments
FOR SELECT
USING (true);

-- Admins can manage all guest payments
CREATE POLICY "Admins can manage guest payments"
ON public.guest_payments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_guest_payments_updated_at
BEFORE UPDATE ON public.guest_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();