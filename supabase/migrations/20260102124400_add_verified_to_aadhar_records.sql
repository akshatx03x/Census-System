-- Add verified column to aadhar_records table
ALTER TABLE public.aadhar_records ADD COLUMN verified BOOLEAN DEFAULT FALSE;
