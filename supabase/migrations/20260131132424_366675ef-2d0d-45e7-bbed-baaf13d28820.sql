-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create ground transport settings table for admin control
CREATE TABLE public.ground_transport_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 200.00,
  price_per_km DECIMAL(10,4) NOT NULL DEFAULT 0.80,
  price_per_mile DECIMAL(10,4) NOT NULL DEFAULT 1.29,
  standard_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  private_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.75,
  companion_base_fee DECIMAL(10,2) NOT NULL DEFAULT 150.00,
  companion_per_km DECIMAL(10,4) NOT NULL DEFAULT 0.10,
  companion_max_fee DECIMAL(10,2) NOT NULL DEFAULT 300.00,
  max_ground_distance_km INTEGER NOT NULL DEFAULT 5000,
  estimated_speed_kmh INTEGER NOT NULL DEFAULT 60,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ground_transport_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings (needed for pricing display)
CREATE POLICY "Anyone can read ground transport settings"
ON public.ground_transport_settings
FOR SELECT
USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can manage ground transport settings"
ON public.ground_transport_settings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Insert default settings row
INSERT INTO public.ground_transport_settings (
  base_price, price_per_km, price_per_mile, 
  standard_multiplier, private_multiplier,
  companion_base_fee, companion_per_km, companion_max_fee,
  max_ground_distance_km, estimated_speed_kmh
) VALUES (
  200.00, 0.80, 1.29,
  1.00, 1.75,
  150.00, 0.10, 300.00,
  5000, 60
);

-- Create trigger for updated_at
CREATE TRIGGER update_ground_transport_settings_updated_at
BEFORE UPDATE ON public.ground_transport_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();