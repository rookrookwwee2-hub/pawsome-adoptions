-- Create table for storing API secrets/keys
CREATE TABLE public.api_secrets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.api_secrets ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage API secrets
CREATE POLICY "Admins can manage API secrets"
ON public.api_secrets
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_api_secrets_updated_at
BEFORE UPDATE ON public.api_secrets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.api_secrets IS 'Stores API keys and secrets that can be enabled/disabled by admins';