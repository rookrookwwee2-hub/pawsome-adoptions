-- Add is_protected column to mark admins that cannot be removed
ALTER TABLE public.user_roles 
ADD COLUMN is_protected boolean NOT NULL DEFAULT false;

-- Add comment explaining the column
COMMENT ON COLUMN public.user_roles.is_protected IS 'Protected admins cannot be removed by other admins';