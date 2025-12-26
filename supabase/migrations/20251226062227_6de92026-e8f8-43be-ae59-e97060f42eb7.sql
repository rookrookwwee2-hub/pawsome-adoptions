-- Fix: Remove overly permissive guest access from foster_applications
-- The current policy exposes all guest applications to anyone

-- Drop the vulnerable policy
DROP POLICY IF EXISTS "Users can view their own applications" ON foster_applications;

-- Create a secure policy that only allows authenticated users to view their own applications
CREATE POLICY "Users can view their own applications"
ON foster_applications FOR SELECT
USING (auth.uid() = user_id);

-- Note: Admins already have access via "Admins can manage foster applications" policy