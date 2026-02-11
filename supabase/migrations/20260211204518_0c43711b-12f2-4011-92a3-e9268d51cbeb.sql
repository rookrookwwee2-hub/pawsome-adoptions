
-- Create air_cargo_settings table (mirrors ground_transport_settings)
CREATE TABLE public.air_cargo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_price NUMERIC NOT NULL DEFAULT 400.00,
  price_per_km NUMERIC NOT NULL DEFAULT 0.60,
  price_per_mile NUMERIC NOT NULL DEFAULT 0.96,
  standard_multiplier NUMERIC NOT NULL DEFAULT 1.00,
  private_multiplier NUMERIC NOT NULL DEFAULT 1.75,
  companion_base_fee NUMERIC NOT NULL DEFAULT 300.00,
  companion_per_km NUMERIC NOT NULL DEFAULT 0.05,
  companion_max_fee NUMERIC NOT NULL DEFAULT 700.00,
  long_flight_threshold_km INTEGER NOT NULL DEFAULT 3000,
  long_flight_companion_fee NUMERIC NOT NULL DEFAULT 700.00,
  average_speed_kmh INTEGER NOT NULL DEFAULT 800,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.air_cargo_settings ENABLE ROW LEVEL SECURITY;

-- Admin can manage
CREATE POLICY "Admins can manage air cargo settings"
  ON public.air_cargo_settings
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role
  ));

-- Anyone can read
CREATE POLICY "Anyone can read air cargo settings"
  ON public.air_cargo_settings
  FOR SELECT
  USING (true);

-- Insert default row
INSERT INTO public.air_cargo_settings (base_price, price_per_km, price_per_mile, standard_multiplier, private_multiplier, companion_base_fee, companion_per_km, companion_max_fee, long_flight_threshold_km, long_flight_companion_fee, average_speed_kmh, is_enabled)
VALUES (400.00, 0.60, 0.96, 1.00, 1.75, 300.00, 0.05, 700.00, 3000, 700.00, 800, true);

-- Add updated_at trigger
CREATE TRIGGER update_air_cargo_settings_updated_at
  BEFORE UPDATE ON public.air_cargo_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
