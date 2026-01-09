-- Force update the blockchain hash function to avoid gen_random_bytes
DROP FUNCTION IF EXISTS public.generate_blockchain_hash();

CREATE OR REPLACE FUNCTION public.generate_blockchain_hash()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN '0x' || md5(random()::text || extract(epoch from now())::text);
END;
$$;
