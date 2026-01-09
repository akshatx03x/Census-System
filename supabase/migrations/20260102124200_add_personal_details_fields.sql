-- Add new columns to census_submissions table for personal details
ALTER TABLE public.census_submissions
ADD COLUMN aadhar_number TEXT,
ADD COLUMN address TEXT,
ADD COLUMN pan_number TEXT,
ADD COLUMN aadhar_image_url TEXT,
ADD COLUMN pan_image_url TEXT;

-- Add constraints for validation
ALTER TABLE public.census_submissions
ADD CONSTRAINT aadhar_number_length CHECK (length(aadhar_number) = 12),
ADD CONSTRAINT pan_number_length CHECK (length(pan_number) = 10);
