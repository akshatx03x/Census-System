-- Create enum for caste categories
CREATE TYPE public.caste_category AS ENUM ('SC', 'ST', 'OBC', 'General', 'Other');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'citizen');

-- Create enum for education levels
CREATE TYPE public.education_level AS ENUM (
  'No formal education',
  'Primary (1-5)',
  'Middle (6-8)',
  'Secondary (9-10)',
  'Higher Secondary (11-12)',
  'Graduate',
  'Post Graduate',
  'Doctorate'
);

-- Create enum for income ranges
CREATE TYPE public.income_range AS ENUM (
  'Below 1 Lakh',
  '1-3 Lakhs',
  '3-5 Lakhs',
  '5-10 Lakhs',
  '10-25 Lakhs',
  'Above 25 Lakhs'
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'citizen',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  mobile_number TEXT,
  pan_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create census_submissions table
CREATE TABLE public.census_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  caste_category caste_category NOT NULL,
  sub_caste TEXT,
  occupation TEXT NOT NULL,
  income_range income_range NOT NULL,
  education_level education_level NOT NULL,
  blockchain_hash TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blockchain_logs table
CREATE TABLE public.blockchain_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.census_submissions(id) ON DELETE CASCADE NOT NULL,
  transaction_hash TEXT NOT NULL,
  state TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verification_status TEXT DEFAULT 'verified',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.census_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for census_submissions
CREATE POLICY "Users can view their own submissions"
ON public.census_submissions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own submissions"
ON public.census_submissions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all submissions"
ON public.census_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for blockchain_logs
CREATE POLICY "Users can view their own blockchain logs"
ON public.blockchain_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.census_submissions cs
    WHERE cs.id = submission_id AND cs.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all blockchain logs"
ON public.blockchain_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert blockchain logs"
ON public.blockchain_logs
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.census_submissions cs
    WHERE cs.id = submission_id AND cs.user_id = auth.uid()
  )
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (new.id);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'citizen');
  
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate mock blockchain hash
CREATE OR REPLACE FUNCTION public.generate_blockchain_hash()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN '0x' || encode(gen_random_bytes(32), 'hex');
END;
$$;

-- Create function to auto-create blockchain log on submission
CREATE OR REPLACE FUNCTION public.handle_new_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_hash TEXT;
BEGIN
  new_hash := public.generate_blockchain_hash();
  
  UPDATE public.census_submissions
  SET blockchain_hash = new_hash
  WHERE id = new.id;
  
  INSERT INTO public.blockchain_logs (submission_id, transaction_hash, state)
  VALUES (new.id, new_hash, new.state);
  
  RETURN new;
END;
$$;

-- Create trigger for new submissions
CREATE TRIGGER on_census_submission_created
  AFTER INSERT ON public.census_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_submission();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();