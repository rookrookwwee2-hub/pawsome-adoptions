-- Create payment_settings table for storing configurable payment details
CREATE TABLE public.payment_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage payment settings
CREATE POLICY "Admins can manage payment settings"
ON public.payment_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can read payment settings (needed for checkout)
CREATE POLICY "Anyone can view payment settings"
ON public.payment_settings
FOR SELECT
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_payment_settings_updated_at
BEFORE UPDATE ON public.payment_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert default USDT settings
INSERT INTO public.payment_settings (setting_key, setting_value)
VALUES (
  'usdt',
  '{"network": "TRC20 (Tron)", "walletAddress": "TXYZabc123def456ghi789jkl012mno345pqr", "note": "Only send USDT on TRC20 network. Other networks will result in loss of funds."}'::jsonb
);

-- Insert default bank details
INSERT INTO public.payment_settings (setting_key, setting_value)
VALUES (
  'bank_details',
  '[
    {
      "id": "uk",
      "region": "UK Local Bank Transfer",
      "subtitle": "BACS / Faster Payments",
      "currency": "GBP",
      "details": [
        {"label": "Bank Name", "value": "Barclays"},
        {"label": "Sort Code", "value": "23-14-86"},
        {"label": "Account Number", "value": "15870922"},
        {"label": "Beneficiary Name", "value": "Kenneth Roberts"}
      ]
    },
    {
      "id": "usa",
      "region": "USA Local Bank Transfer",
      "subtitle": "ACH / Wire",
      "currency": "USD",
      "details": [
        {"label": "Bank Name", "value": "Citibank"},
        {"label": "Bank Address", "value": "111 Wall Street, New York, NY 10043, USA"},
        {"label": "Routing (ABA)", "value": "031100209"},
        {"label": "Account Number", "value": "70589140002133813"},
        {"label": "Account Type", "value": "Checking"},
        {"label": "Beneficiary Name", "value": "Kenneth Roberts"}
      ]
    },
    {
      "id": "eu",
      "region": "Eurozone SEPA Bank Transfer",
      "subtitle": "SEPA",
      "currency": "EUR",
      "details": [
        {"label": "Bank Name", "value": "Banking Circle S.A."},
        {"label": "Bank Address", "value": "2, Boulevard de la Foire, L-1528 Luxembourg"},
        {"label": "IBAN", "value": "LU63 4080 0000 5965 4770"},
        {"label": "BIC (SWIFT)", "value": "BCIRLULL"},
        {"label": "Beneficiary Name", "value": "Kenneth Roberts"}
      ]
    }
  ]'::jsonb
);