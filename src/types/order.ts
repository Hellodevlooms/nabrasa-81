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

export interface CartAdditional {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  additionals: CartAdditional[];
  quantity: number;
  totalPrice: number;
  observations?: string;
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