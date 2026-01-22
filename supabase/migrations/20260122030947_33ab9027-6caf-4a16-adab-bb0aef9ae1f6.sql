-- Create table for Google OAuth settings (admin-only)
CREATE TABLE public.google_oauth_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id text NOT NULL DEFAULT '',
  redirect_uri text NOT NULL DEFAULT '',
  scopes text NOT NULL DEFAULT 'openid email profile',
  enabled boolean NOT NULL DEFAULT false,
  show_on_login boolean NOT NULL DEFAULT true,
  default_user_role app_role NOT NULL DEFAULT 'user'::app_role,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Note: client_secret will be stored in api_secrets table for security

-- Enable RLS
ALTER TABLE public.google_oauth_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage Google OAuth settings
CREATE POLICY "Admins can manage Google OAuth settings"
ON public.google_oauth_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can read enabled status (needed for login page)
CREATE POLICY "Anyone can view enabled status"
ON public.google_oauth_settings
FOR SELECT
USING (true);

-- Create table for Analytics settings (GA/GTM)
CREATE TABLE public.analytics_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ga_measurement_id text DEFAULT '',
  ga_enabled boolean NOT NULL DEFAULT false,
  gtm_container_id text DEFAULT '',
  gtm_enabled boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage analytics settings
CREATE POLICY "Admins can manage analytics settings"
ON public.analytics_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view analytics settings (needed to load scripts)
CREATE POLICY "Anyone can view analytics settings"
ON public.analytics_settings
FOR SELECT
USING (true);

-- Insert default row for settings (singleton pattern)
INSERT INTO public.google_oauth_settings (id) VALUES (gen_random_uuid());
INSERT INTO public.analytics_settings (id) VALUES (gen_random_uuid());

-- Add update triggers
CREATE TRIGGER update_google_oauth_settings_updated_at
BEFORE UPDATE ON public.google_oauth_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_analytics_settings_updated_at
BEFORE UPDATE ON public.analytics_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();