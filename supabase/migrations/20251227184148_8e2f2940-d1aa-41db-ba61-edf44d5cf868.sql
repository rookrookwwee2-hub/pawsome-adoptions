-- Enable realtime for guest_payments table
ALTER TABLE public.guest_payments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guest_payments;