-- Fix: Remove public data exposure from payment_proofs table
-- The current policy allows anyone to view guest payment proofs

-- Drop the vulnerable policy
DROP POLICY IF EXISTS "Users can view their own payment proofs" ON payment_proofs;

-- Create secure policies - only authenticated users can view their own payment proofs
CREATE POLICY "Users can view their own payment proofs"
ON payment_proofs FOR SELECT
USING (auth.uid() = user_id);

-- Note: Admins already have access via "Admins can manage payment proofs" and "Admins can view all payment proofs" policies