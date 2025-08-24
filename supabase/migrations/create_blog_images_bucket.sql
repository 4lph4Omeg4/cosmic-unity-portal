-- Create blog-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Set up RLS policies for the bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE 
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE 
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);
