import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, MenuItem, Additional } from '@/types/order';
import { toast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (menuItem: MenuItem, additionals: Additional[], quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (menuItem: MenuItem, additionals: Additional[], quantity: number) => {
    const totalPrice = (menuItem.price + additionals.reduce((sum, add) => sum + add.price, 0)) * quantity;
    
    const newItem: CartItem = {
      id: Date.now().toString(),
      menuItem,
      additionals,
      quantity,
      totalPrice,
    };

    setItems(prev => [...prev, newItem]);
    toast({
      title: "Item adicionado ao carrinho!",
      description: `${menuItem.name} foi adicionado com sucesso.`,
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removido",
      description: "Item removido do carrinho.",
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const unitPrice = item.menuItem.price + item.additionals.reduce((sum, add) => sum + add.price, 0);
        return {
          ...item,
          quantity,
          totalPrice: unitPrice * quantity,
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};