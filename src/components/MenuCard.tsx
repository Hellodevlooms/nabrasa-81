import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import { MenuItem, Additional } from '@/types/order';
import { useCart } from '@/contexts/CartContext';
import { additionals as allAdditionals } from '@/data/menu';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const [selectedAdditionals, setSelectedAdditionals] = useState<Additional[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');
  const { addToCart } = useCart();

  const handleAdditionalToggle = (additional: Additional) => {
    setSelectedAdditionals(prev => {
      const exists = prev.find(a => a.id === additional.id);
      if (exists) {
        return prev.filter(a => a.id !== additional.id);
      }
      return [...prev, additional];
    });
  };

  const getTotalPrice = () => {
    const additionalsPrice = selectedAdditionals.reduce((sum, add) => sum + add.price, 0);
    return (item.price + additionalsPrice) * quantity;
  };

  const handleAddToCart = () => {
    addToCart(item, selectedAdditionals, quantity, observations);
    setSelectedAdditionals([]);
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
          <h4 className="font-semibold text-primary mb-3">Adicionais:</h4>
          <div className="grid grid-cols-1 gap-2">
            {allAdditionals.map((additional) => (
              <div key={additional.id} className="flex items-center space-x-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`${item.id}-${additional.id}`}
                  checked={selectedAdditionals.some(a => a.id === additional.id)}
                  onCheckedChange={() => handleAdditionalToggle(additional)}
                />
                <label
                  htmlFor={`${item.id}-${additional.id}`}
                  className="flex-1 text-sm cursor-pointer"
                >
                  {additional.name}
                </label>
                <span className="text-sm font-semibold text-burger-orange">
                  + R$ {additional.price.toFixed(2).replace('.', ',')}
                </span>
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