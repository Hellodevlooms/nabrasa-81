-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('dinheiro', 'pix', 'cartao')),
  address TEXT,
  observations TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id TEXT NOT NULL,
  menu_item_name TEXT NOT NULL,
  menu_item_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_item_additionals table for tracking additionals
CREATE TABLE public.order_item_additionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  additional_id TEXT NOT NULL,
  additional_name TEXT NOT NULL,
  additional_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_additionals ENABLE ROW LEVEL SECURITY;

-- Create policies for orders (accessible to all authenticated users)
CREATE POLICY "Authenticated users can view all orders" 
ON public.orders 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policies for order_items
CREATE POLICY "Authenticated users can view all order items" 
ON public.order_items 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policies for order_item_additionals
CREATE POLICY "Authenticated users can view all order item additionals" 
ON public.order_item_additionals 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert order item additionals" 
ON public.order_item_additionals 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_item_additionals_order_item_id ON public.order_item_additionals(order_item_id);