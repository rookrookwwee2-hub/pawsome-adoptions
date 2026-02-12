
-- Add shipping and contact columns to payment_proofs
ALTER TABLE public.payment_proofs
  ADD COLUMN IF NOT EXISTS guest_phone text,
  ADD COLUMN IF NOT EXISTS guest_address text,
  ADD COLUMN IF NOT EXISTS shipping_method text,
  ADD COLUMN IF NOT EXISTS shipping_cost numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS client_notes text;

-- Add shipping columns to guest_payments
ALTER TABLE public.guest_payments
  ADD COLUMN IF NOT EXISTS shipping_method text,
  ADD COLUMN IF NOT EXISTS shipping_cost numeric DEFAULT 0;
