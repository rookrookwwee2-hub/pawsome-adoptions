-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  country TEXT NOT NULL,
  country_flag TEXT,
  pet_type TEXT NOT NULL CHECK (pet_type IN ('cat', 'dog')),
  review_text TEXT NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  display_location TEXT NOT NULL DEFAULT 'reviews_page' CHECK (display_location IN ('homepage', 'reviews_page', 'both')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  adoption_id UUID REFERENCES public.adoptions(id) ON DELETE SET NULL,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON public.reviews
FOR SELECT
USING (status = 'approved');

-- Users can create reviews for their delivered adoptions
CREATE POLICY "Users can create reviews"
ON public.reviews
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own reviews
CREATE POLICY "Users can view their own reviews"
ON public.reviews
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage reviews"
ON public.reviews
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create storage bucket for review photos
INSERT INTO storage.buckets (id, name, public) VALUES ('review-photos', 'review-photos', true);

-- Storage policies for review photos
CREATE POLICY "Anyone can view review photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

CREATE POLICY "Authenticated users can upload review photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'review-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own review photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can manage all review photos"
ON storage.objects FOR ALL
USING (bucket_id = 'review-photos' AND has_role(auth.uid(), 'admin'::app_role));

-- Insert seed reviews (approved)
INSERT INTO public.reviews (customer_name, country, country_flag, pet_type, review_text, status, display_location) VALUES
('Sarah', 'USA', '🇺🇸', 'dog', 'Pawsfam helped me find the sweetest puppy ever. The process was smooth and the care was amazing.', 'approved', 'both'),
('Liam', 'Canada', '🇨🇦', 'cat', 'My kitten arrived healthy and full of energy. Pawsfam truly cares about animals.', 'approved', 'both'),
('Amina', 'UK', '🇬🇧', 'cat', 'I never thought adopting online could feel this safe and personal. Thank you, Pawsfam!', 'approved', 'both'),
('Carlos', 'Spain', '🇪🇸', 'dog', 'The support team was with me every step. My dog is now part of the family.', 'approved', 'both'),
('Yuki', 'Japan', '🇯🇵', 'cat', 'My cat is calm, clean, and clearly well cared for before arrival.', 'approved', 'both'),
('Noah', 'Australia', '🇦🇺', 'dog', 'Best experience ever. Pawsfam matched me with the perfect dog.', 'approved', 'both'),
('Fatima', 'UAE', '🇦🇪', 'cat', 'Professional, kind, and fast. I recommend Pawsfam to everyone.', 'approved', 'homepage'),
('Daniel', 'Germany', '🇩🇪', 'dog', 'My puppy came with full health info and support. Great service.', 'approved', 'homepage'),
('Leila', 'France', '🇫🇷', 'cat', 'Pawsfam treats pets like family. That''s what makes them special.', 'approved', 'reviews_page'),
('Ahmed', 'Egypt', '🇪🇬', 'dog', 'My dog arrived happy and playful. Thank you Pawsfam.', 'approved', 'reviews_page'),
('Sofia', 'Italy', '🇮🇹', 'cat', 'I felt safe from the first message to delivery.', 'approved', 'reviews_page'),
('Lucas', 'Brazil', '🇧🇷', 'dog', 'The whole process was smooth and professional.', 'approved', 'reviews_page'),
('Nina', 'Netherlands', '🇳🇱', 'cat', 'My kitten adjusted so fast at home. She''s perfect.', 'approved', 'reviews_page'),
('Omar', 'Jordan', '🇯🇴', 'dog', 'Great communication and real love for animals.', 'approved', 'reviews_page'),
('Emily', 'USA', '🇺🇸', 'cat', 'My cat is my best friend now thanks to Pawsfam.', 'approved', 'reviews_page'),
('Hassan', 'Morocco', '🇲🇦', 'dog', 'Pawsfam made adoption simple and safe.', 'approved', 'reviews_page'),
('Maya', 'India', '🇮🇳', 'cat', 'Wonderful service and beautiful pets.', 'approved', 'reviews_page'),
('Victor', 'Mexico', '🇲🇽', 'dog', 'My dog is healthy, trained, and lovely.', 'approved', 'reviews_page'),
('Aya', 'Turkey', '🇹🇷', 'cat', 'I trust Pawsfam with my heart.', 'approved', 'reviews_page'),
('Robert', 'Sweden', '🇸🇪', 'dog', 'Everything was clear and honest.', 'approved', 'reviews_page'),
('Luna', 'Argentina', '🇦🇷', 'cat', 'My kitten arrived in perfect condition.', 'approved', 'reviews_page'),
('Sam', 'USA', '🇺🇸', 'dog', 'I''ll definitely adopt again from Pawsfam.', 'approved', 'reviews_page'),
('Huda', 'Saudi Arabia', '🇸🇦', 'cat', 'Fast, clean, and very respectful service.', 'approved', 'reviews_page'),
('Marco', 'Portugal', '🇵🇹', 'dog', 'Pawsfam connects people with real companions.', 'approved', 'reviews_page'),
('Zara', 'South Africa', '🇿🇦', 'cat', 'My home feels alive now thanks to my cat from Pawsfam.', 'approved', 'reviews_page');