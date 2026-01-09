-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.generate_blockchain_hash();

-- Create function to generate mock blockchain hash without gen_random_bytes
CREATE OR REPLACE FUNCTION public.generate_blockchain_hash()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN '0x' || md5(random()::text || extract(epoch from now())::text);
END;
$$;
