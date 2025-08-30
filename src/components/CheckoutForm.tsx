import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { OrderDetails } from '@/types/order';
import { toast } from '@/hooks/use-toast';

interface CheckoutFormProps {
  onBack: () => void;
}

// 1. Definindo a constante para a taxa de entrega
const DELIVERY_FEE = 3.00;

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onBack }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    deliveryType: 'pickup',
    paymentMethod: 'dinheiro',
    customerName: '',
    customerPhone: '',
    address: '',
    observations: '',
  });

  // 2. Criando uma função para calcular o total final
  const calculateFinalTotal = () => {
    const itemsTotal = getTotalPrice();
    if (orderDetails.deliveryType === 'delivery') {
      return itemsTotal + DELIVERY_FEE;
    }
    return itemsTotal;
  };

  const finalTotal = calculateFinalTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderDetails.customerName || !orderDetails.customerPhone) {
      toast({
        title: "Dados obrigatórios",
        description: "Por favor, preencha nome e telefone.",
        variant: "destructive",
      });
      return;
    }

    if (orderDetails.deliveryType === 'delivery' && !orderDetails.address) {
      toast({
        title: "Endereço obrigatório",
        description: "Por favor, informe o endereço para delivery.",
        variant: "destructive",
      });
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/5518996277667?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    toast({
      title: "Pedido enviado!",
      description: "Seu pedido foi enviado pelo WhatsApp. Aguarde o contato!",
    });
  };

  const generateWhatsAppMessage = () => {
    let message = "🍔 *NOVO PEDIDO - NA BRASA BURGUER*\n\n";
    
    message += `👤 *Cliente:* ${orderDetails.customerName}\n`;
    message += `📞 *Telefone:* ${orderDetails.customerPhone}\n\n`;
    
    message += "🍔 *ITENS DO PEDIDO:*\n";
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.menuItem.name}* (${item.quantity}x)\n`;
      message += `   Preço unitário: R$ ${item.menuItem.price.toFixed(2).replace('.', ',')}\n`;
      
      if (item.additionals.length > 0) {
        message += "   Adicionais:\n";
        item.additionals.forEach(add => {
          message += `   • ${add.name} (+R$ ${add.price.toFixed(2).replace('.', ',')})\n`;
        });
      }
      
      if (item.observations) {
        message += `   📝 Observações: ${item.observations}\n`;
      }
      
      message += `   Subtotal: R$ ${item.totalPrice.toFixed(2).replace('.', ',')}\n\n`;
    });
    
    // 3. Ajustando a mensagem do WhatsApp
    message += ` SUBTOTAL DOS ITENS: R$ ${getTotalPrice().toFixed(2).replace('.', ',')}\n`;

    if (orderDetails.deliveryType === 'delivery') {
      message += `🛵 *Taxa de Entrega:* R$ ${DELIVERY_FEE.toFixed(2).replace('.', ',')}\n`;
    }

    message += `💰 *TOTAL GERAL: R$ ${finalTotal.toFixed(2).replace('.', ',')}*\n\n`;
    
    message += `🚚 *Tipo:* ${orderDetails.deliveryType === 'delivery' ? 'Delivery' : 'Retirada'}\n`;
    
    if (orderDetails.deliveryType === 'delivery' && orderDetails.address) {
      message += `📍 *Endereço:* ${orderDetails.address}\n`;
    }
    
    message += `💳 *Pagamento:* ${
      orderDetails.paymentMethod === 'dinheiro' ? 'Dinheiro' :
      orderDetails.paymentMethod === 'pix' ? 'PIX' : 'Cartão'
    }\n\n`;
    
    if (orderDetails.observations) {
      message += `📝 *Observações:* ${orderDetails.observations}\n\n`;
    }
    
    message += "Obrigado pela preferência! 🙏";
    
    return message;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle>Finalizar Pedido</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-primary">Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={orderDetails.customerName}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={orderDetails.customerPhone}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="(18) 99999-9999"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Type */}
          <div className="space-y-4">
            <h3 className="font-semibold text-primary">Tipo de Entrega</h3>
            <RadioGroup
              value={orderDetails.deliveryType}
              onValueChange={(value: 'delivery' | 'pickup') => 
                setOrderDetails(prev => ({ ...prev, deliveryType: value }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup">Retirada no local</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery">Delivery</Label>
              </div>
            </RadioGroup>

            {/* 4. Exibindo a mensagem da taxa de entrega e o campo de endereço */}
            {orderDetails.deliveryType === 'delivery' && (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Taxa de entrega: R$ {DELIVERY_FEE.toFixed(2).replace('.', ',')}
                </p>
                <div>
                  <Label htmlFor="address">Endereço para entrega *</Label>
                  <Input
                    id="address"
                    value={orderDetails.address}
                    onChange={(e) => setOrderDetails(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, número, bairro, cidade"
                    required={orderDetails.deliveryType === 'delivery'}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Payment Method (sem alterações) */}
          <div className="space-y-4">
            <h3 className="font-semibold text-primary">Forma de Pagamento</h3>
            <RadioGroup
              value={orderDetails.paymentMethod}
              onValueChange={(value: 'dinheiro' | 'pix' | 'cartao') => 
                setOrderDetails(prev => ({ ...prev, paymentMethod: value }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dinheiro" id="dinheiro" />
                <Label htmlFor="dinheiro">Dinheiro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix">PIX</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cartao" id="cartao" />
                <Label htmlFor="cartao">Cartão</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Observations (sem alterações) */}
          <div className="space-y-4">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={orderDetails.observations}
              onChange={(e) => setOrderDetails(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Alguma observação especial?"
              rows={3}
            />
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="font-semibold text-primary">Resumo do Pedido</h3>
            <div className="text-2xl font-bold text-center text-primary">
              {/* 5. Atualizando o total exibido na tela */}
              Total: R$ {finalTotal.toFixed(2).replace('.', ',')}
            </div>
          </div>

          <Button type="submit" variant="burger" className="w-full" size="lg">
            <MessageCircle className="w-4 h-4 mr-2" />
            Enviar Pedido pelo WhatsApp
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
