-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  donation_type TEXT NOT NULL DEFAULT 'one-time', -- 'one-time' or 'monthly'
  message TEXT,
  proof_file_url TEXT,
  proof_file_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  admin_notes TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create foster_applications table
CREATE TABLE public.foster_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  housing_type TEXT, -- 'house', 'apartment', 'condo', 'other'
  has_yard BOOLEAN DEFAULT false,
  has_other_pets BOOLEAN DEFAULT false,
  other_pets_details TEXT,
  has_children BOOLEAN DEFAULT false,
  children_ages TEXT,
  experience TEXT,
  availability TEXT, -- 'short-term', 'long-term', 'both'
  preferred_pet_types TEXT[], -- ['dog', 'cat', etc.]
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'active'
  admin_notes TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create foster_assignments table to track which pets are with which foster families
CREATE TABLE public.foster_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  foster_application_id UUID NOT NULL REFERENCES public.foster_applications(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foster_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foster_assignments ENABLE ROW LEVEL SECURITY;

-- Donations policies
CREATE POLICY "Anyone can create donations"
ON public.donations FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own donations"
ON public.donations FOR SELECT
USING ((auth.uid() = user_id) OR (user_id IS NULL AND donor_email IS NOT NULL));

CREATE POLICY "Admins can manage donations"
ON public.donations FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Foster applications policies
CREATE POLICY "Anyone can create foster applications"
ON public.foster_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own applications"
ON public.foster_applications FOR SELECT
USING ((auth.uid() = user_id) OR (user_id IS NULL AND applicant_email IS NOT NULL));

CREATE POLICY "Admins can manage foster applications"
ON public.foster_applications FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Foster assignments policies
CREATE POLICY "Admins can manage foster assignments"
ON public.foster_assignments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view foster assignments"
ON public.foster_assignments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at triggers
CREATE TRIGGER update_donations_updated_at
BEFORE UPDATE ON public.donations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_foster_applications_updated_at
BEFORE UPDATE ON public.foster_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_foster_assignments_updated_at
BEFORE UPDATE ON public.foster_assignments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();