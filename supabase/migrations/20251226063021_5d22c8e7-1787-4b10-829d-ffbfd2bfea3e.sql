-- Fix: Remove public data exposure from guest_payments table
-- The current policy allows anyone to SELECT all guest payments

-- Drop the vulnerable policy
DROP POLICY IF EXISTS "Anyone can view payments by email" ON guest_payments;

-- Create a secure policy - only admins can view guest payments
-- Guests cannot view their own payments without authentication (they get confirmation via email/receipt)
CREATE POLICY "Admins can view all guest payments"
ON guest_payments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix: Remove public data exposure from donations table  
-- The current policy allows anyone to view guest donations

-- Drop the vulnerable policy
DROP POLICY IF EXISTS "Users can view their own donations" ON donations;

-- Create secure policies - only authenticated users can view their own donations
CREATE POLICY "Users can view their own donations"
ON donations FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all donations (already have ALL access, but explicit SELECT is cleaner)
CREATE POLICY "Admins can view all donations"
ON donations FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));