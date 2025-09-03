-- Adicionar coluna de status aos pedidos
ALTER TABLE public.orders 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Criar índice para melhor performance nas consultas por status
CREATE INDEX idx_orders_status ON public.orders (status);

-- Comentário para documentar os valores possíveis
COMMENT ON COLUMN public.orders.status IS 'Status do pedido: pending (pendente) ou completed (finalizado)';