import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import { MenuItem, Additional, CartAdditional } from '@/types/order';
import { useCart } from '@/contexts/CartContext';
import { additionals as allAdditionals } from '@/data/menu';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const [selectedAdditionals, setSelectedAdditionals] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');
  const { addToCart } = useCart();

  const handleAdditionalQuantityChange = (additionalId: string, newQuantity: number) => {
    setSelectedAdditionals(prev => ({
      ...prev,
      [additionalId]: Math.max(0, newQuantity)
    }));
  };

  const getTotalPrice = () => {
    const additionalsPrice = Object.entries(selectedAdditionals).reduce((sum, [id, qty]) => {
      const additional = allAdditionals.find(a => a.id === id);
      return sum + (additional ? additional.price * qty : 0);
    }, 0);
    return (item.price + additionalsPrice) * quantity;
  };

  const handleAddToCart = () => {
    const cartAdditionals: CartAdditional[] = Object.entries(selectedAdditionals)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const additional = allAdditionals.find(a => a.id === id)!;
        return {
          ...additional,
          quantity: qty
        };
      });
    
    addToCart(item, cartAdditionals, quantity, observations);
    setSelectedAdditionals({});
    setQuantity(1);
    setObservations('');
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 transform border-2 hover:border-burger-gold">
      <CardHeader>
        <CardTitle className="text-primary">{item.name}</CardTitle>
        <p className="text-muted-foreground text-sm">{item.description}</p>
        <p className="text-2xl font-bold text-burger-orange">
          R$ {item.price.toFixed(2).replace('.', ',')}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-primary mb-3">Adicionais (selecione a quantidade):</h4>
          <div className="grid grid-cols-1 gap-3">
            {allAdditionals.map((additional) => (
              <div key={additional.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <span className="text-sm font-medium">{additional.name}</span>
                  <div className="text-sm text-burger-orange font-semibold">
                    R$ {additional.price.toFixed(2).replace('.', ',')} cada
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdditionalQuantityChange(additional.id, (selectedAdditionals[additional.id] || 0) - 1)}
                    disabled={!selectedAdditionals[additional.id]}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-bold text-lg">
                    {selectedAdditionals[additional.id] || 0}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdditionalQuantityChange(additional.id, (selectedAdditionals[additional.id] || 0) + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-primary mb-3">Observações:</h4>
          <Textarea
            placeholder="Alguma observação especial? (Ex: sem cebola, ponto da carne, etc.)"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold">Quantidade:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="mx-4 font-bold text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <div className="w-full text-center">
          <p className="text-lg font-bold text-primary">
            Total: R$ {getTotalPrice().toFixed(2).replace('.', ',')}
          </p>
        </div>
        <Button 
          variant="burger" 
          className="w-full"
          onClick={handleAddToCart}
        >
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuCard;