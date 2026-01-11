-- Create new table for aadhar records
CREATE TABLE public.aadhar_records (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    aadhar_number TEXT NOT NULL
);

-- Insert sample data
INSERT INTO public.aadhar_records (name, aadhar_number) VALUES
('Dayanand Ningayya Mayur', '4828 8429 4931'),
('Akshat Gupta', '123456789012'),
('SAMARTH SHARMA', '123456789013'),
('SID MALHORTA', '342506531151');
