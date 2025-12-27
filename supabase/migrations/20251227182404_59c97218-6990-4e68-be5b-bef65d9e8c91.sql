-- Add new health badge fields to pets table
ALTER TABLE public.pets
ADD COLUMN IF NOT EXISTS fiv_felv_negative boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS fvrcp_vaccine boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS rabies_vaccine boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS health_certificate boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS pet_passport boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS dewormed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS genetic_health_guarantee boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS genetic_health_years integer DEFAULT 1;

-- Add video and additional info fields
ALTER TABLE public.pets
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS weight numeric;

-- Add travel pricing options
ALTER TABLE public.pets
ADD COLUMN IF NOT EXISTS flight_nanny_price numeric DEFAULT 1500,
ADD COLUMN IF NOT EXISTS air_cargo_usa_price numeric DEFAULT 600,
ADD COLUMN IF NOT EXISTS air_cargo_canada_price numeric DEFAULT 950,
ADD COLUMN IF NOT EXISTS ground_transport_price numeric DEFAULT 50;

-- Add comment to describe new fields
COMMENT ON COLUMN public.pets.fiv_felv_negative IS 'FIV/FeLV tested negative';
COMMENT ON COLUMN public.pets.fvrcp_vaccine IS 'FVRCP vaccination completed';
COMMENT ON COLUMN public.pets.rabies_vaccine IS 'Rabies vaccination completed';
COMMENT ON COLUMN public.pets.health_certificate IS 'Veterinary health certificate issued';
COMMENT ON COLUMN public.pets.pet_passport IS 'Pet passport for international travel';
COMMENT ON COLUMN public.pets.dewormed IS 'Deworming treatment completed';
COMMENT ON COLUMN public.pets.genetic_health_guarantee IS 'Genetic health guarantee included';
COMMENT ON COLUMN public.pets.genetic_health_years IS 'Years of genetic health guarantee coverage';
COMMENT ON COLUMN public.pets.video_url IS 'URL to pet video';
COMMENT ON COLUMN public.pets.birth_date IS 'Pet birth date';
COMMENT ON COLUMN public.pets.weight IS 'Pet weight in pounds';
COMMENT ON COLUMN public.pets.flight_nanny_price IS 'In-cabin flight nanny service price';
COMMENT ON COLUMN public.pets.air_cargo_usa_price IS 'Air cargo shipping price within USA';
COMMENT ON COLUMN public.pets.air_cargo_canada_price IS 'Air cargo shipping price to Canada';
COMMENT ON COLUMN public.pets.ground_transport_price IS 'Ground transport base price';