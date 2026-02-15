
-- Add payment_category to payment_proofs for unified proof tracking
ALTER TABLE public.payment_proofs 
ADD COLUMN IF NOT EXISTS payment_category text NOT NULL DEFAULT 'order_full';

-- Add deposit tracking fields
ALTER TABLE public.payment_proofs 
ADD COLUMN IF NOT EXISTS full_order_total numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS deposit_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS remaining_balance numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_status text DEFAULT 'not_applicable';

-- Add same fields to guest_payments for consistency
ALTER TABLE public.guest_payments 
ADD COLUMN IF NOT EXISTS payment_category text NOT NULL DEFAULT 'order_full',
ADD COLUMN IF NOT EXISTS full_order_total numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS deposit_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS remaining_balance numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_status text DEFAULT 'not_applicable';
