-- Allow public users to create orders (customers placing orders)
DROP POLICY IF EXISTS "Only authorized staff can insert orders" ON public.orders;
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Allow public users to create order items
DROP POLICY IF EXISTS "Only authorized staff can insert order items" ON public.order_items;
CREATE POLICY "Anyone can create order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

-- Allow public users to create order item additionals
DROP POLICY IF EXISTS "Only authorized staff can insert order item additionals" ON public.order_item_additionals;
CREATE POLICY "Anyone can create order item additionals" 
ON public.order_item_additionals 
FOR INSERT 
WITH CHECK (true);

-- Allow staff to update order status
CREATE POLICY "Staff can update orders" 
ON public.orders 
FOR UPDATE 
USING (is_authorized_staff(auth.uid()))
WITH CHECK (is_authorized_staff(auth.uid()));