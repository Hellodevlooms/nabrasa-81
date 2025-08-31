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
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] transform border hover:border-burger-gold">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-primary text-lg md:text-xl">{item.name}</CardTitle>
        <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">{item.description}</p>
        <p className="text-xl md:text-2xl font-bold text-burger-orange">
          R$ {item.price.toFixed(2).replace('.', ',')}
        </p>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
        <div>
          <h4 className="font-semibold text-primary mb-2 text-sm md:text-base">Adicionais:</h4>
          <div className="grid grid-cols-1 gap-2">
            {allAdditionals.map((additional) => (
              <div key={additional.id} className="flex items-center justify-between p-2 md:p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <span className="text-xs md:text-sm font-medium truncate block">{additional.name}</span>
                  <div className="text-xs md:text-sm text-burger-orange font-semibold">
                    R$ {additional.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 md:h-8 md:w-8 p-0"
                    onClick={() => handleAdditionalQuantityChange(additional.id, (selectedAdditionals[additional.id] || 0) - 1)}
                    disabled={!selectedAdditionals[additional.id]}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-6 md:w-8 text-center font-bold text-sm md:text-base">
                    {selectedAdditionals[additional.id] || 0}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 md:h-8 md:w-8 p-0"
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
          <h4 className="font-semibold text-primary mb-2 text-sm md:text-base">Observações:</h4>
          <Textarea
            placeholder="Observações especiais..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="resize-none text-sm"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm md:text-base">Quantidade:</span>
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 md:h-8 md:w-8 p-0"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
            <span className="mx-2 md:mx-4 font-bold text-sm md:text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 md:h-8 md:w-8 p-0"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 md:gap-3 p-4 md:p-6">
        <div className="w-full text-center">
          <p className="text-base md:text-lg font-bold text-primary">
            Total: R$ {getTotalPrice().toFixed(2).replace('.', ',')}
          </p>
        </div>
        <Button 
          variant="burger" 
          className="w-full text-sm md:text-base"
          onClick={handleAddToCart}
        >
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuCard;