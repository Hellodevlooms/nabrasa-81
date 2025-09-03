-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'staff');

-- Create user_roles table to manage access levels
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'staff',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin or manager
CREATE OR REPLACE FUNCTION public.is_authorized_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'manager')
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop existing insecure policies for orders
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;

-- Create secure RLS policies for orders table
CREATE POLICY "Only authorized staff can view orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_authorized_staff(auth.uid()));

CREATE POLICY "Only authorized staff can insert orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (public.is_authorized_staff(auth.uid()));

-- Update order_items policies
DROP POLICY IF EXISTS "Authenticated users can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can insert order items" ON public.order_items;

CREATE POLICY "Only authorized staff can view order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (public.is_authorized_staff(auth.uid()));

CREATE POLICY "Only authorized staff can insert order items"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (public.is_authorized_staff(auth.uid()));

-- Update order_item_additionals policies
DROP POLICY IF EXISTS "Authenticated users can view all order item additionals" ON public.order_item_additionals;
DROP POLICY IF EXISTS "Authenticated users can insert order item additionals" ON public.order_item_additionals;

CREATE POLICY "Only authorized staff can view order item additionals"
ON public.order_item_additionals
FOR SELECT
TO authenticated
USING (public.is_authorized_staff(auth.uid()));

CREATE POLICY "Only authorized staff can insert order item additionals"
ON public.order_item_additionals
FOR INSERT
TO authenticated
WITH CHECK (public.is_authorized_staff(auth.uid()));

-- Insert default admin role for the first user (you'll need to update this with actual user_id)
-- This is commented out - you'll need to manually assign roles to users through the dashboard
-- INSERT INTO public.user_roles (user_id, role) VALUES ('your-user-id-here', 'admin');