import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartProps {
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Seu Carrinho
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Seu carrinho está vazio</p>
          <p className="text-sm text-muted-foreground mt-2">
            Adicione alguns itens deliciosos do nosso menu!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Seu Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-primary">{item.menuItem.name}</h4>
                <p className="text-sm text-muted-foreground">
                  R$ {item.menuItem.price.toFixed(2).replace('.', ',')}
                </p>
                {item.additionals.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-burger-orange">Adicionais:</p>
                    <ul className="text-xs text-muted-foreground">
                      {item.additionals.map((add) => (
                        <li key={add.id}>
                          • {add.name} (+R$ {add.price.toFixed(2).replace('.', ',')})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.observations && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-burger-orange">Observações:</p>
                    <p className="text-xs text-muted-foreground italic">
                      "{item.observations}"
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="mx-2 font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">
                  R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">
            R$ {getTotalPrice().toFixed(2).replace('.', ',')}
          </span>
        </div>

        <Button 
          variant="burger" 
          className="w-full"
          onClick={onCheckout}
        >
          Finalizar Pedido
        </Button>
      </CardContent>
    </Card>
  );
};

export default Cart;