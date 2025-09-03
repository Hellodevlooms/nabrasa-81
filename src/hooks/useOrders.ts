import { useState } from 'react';
import { CartItem, OrderDetails } from '@/types/order';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      // Generate order number
      const orderNumber = Math.floor(Math.random() * 9000) + 1000;
      
      // Calculate subtotal (total without delivery fee)
      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const deliveryFee = orderDetails.deliveryType === 'delivery' ? 3.00 : 0;

      // Save order to database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: orderDetails.customerName,
          customer_phone: orderDetails.customerPhone,
          delivery_type: orderDetails.deliveryType,
          payment_method: orderDetails.paymentMethod,
          address: orderDetails.address,
          observations: orderDetails.observations,
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          total: finalTotal
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Save order items
      for (const item of items) {
        const { data: orderItemData, error: orderItemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderData.id,
            menu_item_id: item.menuItem.id,
            menu_item_name: item.menuItem.name,
            menu_item_price: item.menuItem.price,
            quantity: item.quantity,
            total_price: item.totalPrice,
            observations: item.observations
          })
          .select()
          .single();

        if (orderItemError) throw orderItemError;

        // Save additionals for this order item
        for (const additional of item.additionals) {
          const { error: additionalError } = await supabase
            .from('order_item_additionals')
            .insert({
              order_item_id: orderItemData.id,
              additional_id: additional.id,
              additional_name: additional.name,
              additional_price: additional.price,
              quantity: additional.quantity
            });

          if (additionalError) throw additionalError;
        }
      }

      toast({
        title: "Pedido salvo!",
        description: `Pedido #${orderNumber} registrado no sistema.`,
      });

      return {
        id: orderData.id,
        order_number: orderNumber,
        created_at: orderData.created_at
      };
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
      // Get total orders and revenue
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total, created_at');
      
      if (ordersError) throw ordersError;

      const totalOrders = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0) || 0;

      // Get top selling items
      const { data: topItemsData, error: topItemsError } = await supabase
        .from('order_items')
        .select(`
          menu_item_name,
          quantity,
          total_price
        `);

      if (topItemsError) throw topItemsError;

      // Calculate top items by grouping and summing
      const itemsMap = new Map();
      topItemsData?.forEach(item => {
        const name = item.menu_item_name;
        if (itemsMap.has(name)) {
          const existing = itemsMap.get(name);
          itemsMap.set(name, {
            name,
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + parseFloat(item.total_price.toString())
          });
        } else {
          itemsMap.set(name, {
            name,
            quantity: item.quantity,
            revenue: parseFloat(item.total_price.toString())
          });
        }
      });

      const topItems = Array.from(itemsMap.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // Get daily revenue for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: dailyData, error: dailyError } = await supabase
        .from('orders')
        .select('total, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (dailyError) throw dailyError;

      // Group by date
      const dailyMap = new Map();
      
      // Initialize all 30 days with 0
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toISOString().split('T')[0];
        dailyMap.set(dateStr, 0);
      }

      // Add actual revenue data
      dailyData?.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        if (dailyMap.has(date)) {
          dailyMap.set(date, dailyMap.get(date) + parseFloat(order.total.toString()));
        }
      });

      const dailyRevenue = Array.from(dailyMap.entries()).map(([date, revenue]) => ({
        date,
        revenue
      }));

      // Get monthly revenue for last 12 months
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const { data: monthlyData, error: monthlyError } = await supabase
        .from('orders')
        .select('total, created_at')
        .gte('created_at', twelveMonthsAgo.toISOString());

      if (monthlyError) throw monthlyError;

      // Group by month
      const monthlyMap = new Map();
      
      // Initialize all 12 months with 0
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        const monthStr = date.toISOString().substring(0, 7);
        monthlyMap.set(monthStr, 0);
      }

      // Add actual revenue data
      monthlyData?.forEach(order => {
        const month = new Date(order.created_at).toISOString().substring(0, 7);
        if (monthlyMap.has(month)) {
          monthlyMap.set(month, monthlyMap.get(month) + parseFloat(order.total.toString()));
        }
      });

      const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({
        month,
        revenue
      }));

      return {
        totalOrders,
        totalRevenue,
        topItems,
        dailyRevenue,
        monthlyRevenue
      };
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      throw error;
    }
  };

  const getRecentOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            order_item_additionals (*)
          )
        `)
        .eq('status', 'pending') // Apenas pedidos pendentes
        .order('created_at', { ascending: false })
        .limit(4);

      if (ordersError) throw ordersError;
      return ordersData || [];
    } catch (error) {
      console.error('Erro ao buscar pedidos recentes:', error);
      throw error;
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Pedido finalizado!",
        description: "Pedido marcado como concluído pela cozinha.",
      });
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast({
        title: "Erro ao finalizar",
        description: "Houve um problema ao finalizar o pedido.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    saveOrder,
    getOrderMetrics,
    getRecentOrders,
    completeOrder,
    loading
  };
};