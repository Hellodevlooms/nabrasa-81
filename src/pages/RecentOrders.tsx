import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { ArrowLeft, Clock, User as UserIcon, Phone, Package, CreditCard } from 'lucide-react';

export default function RecentOrders() {
  const { getRecentOrders } = useOrders();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      loadOrders();
    };

    checkAuth();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      const data = await getRecentOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeliveryTypeLabel = (type: string) => {
    return type === 'delivery' ? 'Entrega' : 'Retirada';
  };

  const getDeliveryTypeColor = (type: string) => {
    return type === 'delivery' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: { [key: string]: string } = {
      'dinheiro': 'Dinheiro',
      'pix': 'PIX',
      'cartao': 'Cartão'
    };
    return methods[method] || method;
  };

  if (loading || !user) {
    return <div className="container mx-auto p-6">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Últimos Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">Nenhum pedido encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span>Pedido #{order.order_number}</span>
                      <Badge className={`${getDeliveryTypeColor(order.delivery_type)}`}>
                        {getDeliveryTypeLabel(order.delivery_type)}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDateTime(order.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        {order.customer_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {order.customer_phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {getPaymentMethodLabel(order.payment_method)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(parseFloat(order.total.toString()))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{item.menu_item_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {item.quantity} • Preço unitário: {formatCurrency(parseFloat(item.menu_item_price.toString()))}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">
                            {formatCurrency(parseFloat(item.total_price.toString()))}
                          </div>
                        </div>
                      </div>

                      {item.order_item_additionals.length > 0 && (
                        <div className="mb-3">
                          <h5 className="font-medium text-sm mb-2">Adicionais:</h5>
                          <div className="space-y-1">
                            {item.order_item_additionals.map((additional: any) => (
                              <div key={additional.id} className="flex justify-between text-sm">
                                <span>
                                  {additional.additional_name} x{additional.quantity}
                                </span>
                                <span className="text-muted-foreground">
                                  {formatCurrency(parseFloat(additional.additional_price.toString()) * additional.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.observations && (
                        <div className="mt-3 p-2 bg-muted/50 rounded">
                          <p className="text-sm">
                            <strong>Observações:</strong> {item.observations}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {order.observations && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm">
                        <strong>Observações do Pedido:</strong> {order.observations}
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(parseFloat(order.subtotal.toString()))}</span>
                    </div>
                    {order.delivery_fee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Taxa de entrega:</span>
                        <span>{formatCurrency(parseFloat(order.delivery_fee.toString()))}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(parseFloat(order.total.toString()))}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}