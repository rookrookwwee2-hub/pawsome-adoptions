-- Add structured location columns to pets table for country/region selection
ALTER TABLE public.pets 
ADD COLUMN IF NOT EXISTS location_country TEXT,
ADD COLUMN IF NOT EXISTS location_region TEXT;

-- Create index for faster location-based queries
CREATE INDEX IF NOT EXISTS idx_pets_location_country ON public.pets(location_country);

-- Add comment for documentation
COMMENT ON COLUMN public.pets.location_country IS 'Country ID from worldLocations (e.g., usa, france, uk)';
COMMENT ON COLUMN public.pets.location_region IS 'Region ID from worldLocations (e.g., us-ca, fr-idf)';