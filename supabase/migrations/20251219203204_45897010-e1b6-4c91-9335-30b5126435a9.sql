-- Create storage bucket for pet images
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true);

-- Allow anyone to view pet images (public bucket)
CREATE POLICY "Anyone can view pet images"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-images');

-- Allow admins to upload pet images
CREATE POLICY "Admins can upload pet images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pet-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update pet images
CREATE POLICY "Admins can update pet images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pet-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete pet images
CREATE POLICY "Admins can delete pet images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pet-images' 
  AND public.has_role(auth.uid(), 'admin')
);
