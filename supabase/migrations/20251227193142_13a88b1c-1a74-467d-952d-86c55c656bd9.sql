-- Create storage bucket for pet videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-videos', 'pet-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to pet videos
CREATE POLICY "Pet videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-videos');

-- Allow admins to upload pet videos
CREATE POLICY "Admins can upload pet videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pet-videos' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update pet videos
CREATE POLICY "Admins can update pet videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pet-videos' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete pet videos
CREATE POLICY "Admins can delete pet videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'pet-videos' AND has_role(auth.uid(), 'admin'::app_role));