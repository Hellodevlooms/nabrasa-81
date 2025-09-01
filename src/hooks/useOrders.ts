import { useState } from 'react';
import { CartItem, OrderDetails } from '@/types/order';
import { toast } from '@/hooks/use-toast';

interface OrderMetrics {
  totalOrders: number;
  totalRevenue: number;
  topItems: { name: string; quantity: number; revenue: number }[];
  dailyRevenue: { date: string; revenue: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

export const useOrders = () => {
  const [loading, setLoading] = useState(false);

  const saveOrder = async (items: CartItem[], orderDetails: OrderDetails, finalTotal: number) => {
    setLoading(true);
    try {
      // Simulação por enquanto - será implementado quando as tabelas estiverem criadas
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrder = {
        id: Date.now().toString(),
        order_number: Math.floor(Math.random() * 1000) + 1,
        created_at: new Date().toISOString()
      };

      toast({
        title: "Pedido salvo!",
        description: `Pedido #${mockOrder.order_number} registrado no sistema.`,
      });

      return mockOrder;
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      toast({
        title: "Erro ao salvar",
        description: "Houve um problema ao registrar o pedido.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrderMetrics = async (): Promise<OrderMetrics> => {
    try {
      // Métricas zeradas para iniciar do zero
      return {
        totalOrders: 0,
        totalRevenue: 0.00,
        topItems: [],
        dailyRevenue: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          revenue: 0
        })),
        monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(new Date().getFullYear(), new Date().getMonth() - (11 - i), 1).toISOString().substring(0, 7),
          revenue: 0
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      throw error;
    }
  };

  return {
    saveOrder,
    getOrderMetrics,
    loading
  };
};