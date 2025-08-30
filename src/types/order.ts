export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface Additional {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  additionals: Additional[];
  quantity: number;
  totalPrice: number;
}

export interface OrderDetails {
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: 'dinheiro' | 'pix' | 'cartao';
  customerName: string;
  customerPhone: string;
  address?: string;
  observations?: string;
}

export interface Order {
  items: CartItem[];
  orderDetails: OrderDetails;
  total: number;
}