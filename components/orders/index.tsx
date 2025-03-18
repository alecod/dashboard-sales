'use client'
import { TableProducts } from '@/components/tables/product-table'
import { Badge } from '@/components/ui/badge'
import { useShopifyOrdersHook } from '@/hooks/orders-shopify-hook'
import {
  Calendar,
  CircleDollarSign,
  CreditCard,
  NotepadText,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Customer {
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
}

interface Order {
  id: number
  created_at: string
  total: string
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  items: any[] // Define this based on the structure of items
  customer: Customer
  financial_status: string
}

interface OrderDetailsProps {
  orderId: string
}

const getStatusProps = (status: string) => {
  switch (status) {
    case 'paid':
      return { label: 'Pago', color: '#70c08b' }
    case 'pending':
      return { label: 'Pendente', color: '#ffeb3b' }
    case 'voided':
      return { label: 'Cancelado', color: 'red' }
    case 'refunded':
      return { label: 'Reembolsado', color: 'blue' }
    default:
      return { label: 'Desconhecido', color: 'gray' }
  }
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const { shopifyOrdersData, isLoadingShopifyOrders } = useShopifyOrdersHook()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (shopifyOrdersData?.data) {
      const foundOrder = shopifyOrdersData.data.find(
        (o: Order) => o.id === Number(orderId),
      )
      setOrder(foundOrder || null)
    }
  }, [shopifyOrdersData?.data, orderId])

  if (isLoadingShopifyOrders) {
    return <div>Carregando...</div>
  }

  if (!order) {
    return <div>Pedido não encontrado</div>
  }

  const { label: statusLabel, color: statusColor } = getStatusProps(
    order?.financial_status,
  )

  return (
    <div className=''>
      <div className='mt-5'>
        <div className='h-[1px] w-full bg-k-default/50' />
        <div className='flex h-16 items-center justify-start gap-7'>
          <div className='flex items-center gap-2'>
            <NotepadText fill='' size={20} />
            <span>ID do Pedido: {order?.id}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Calendar fill='' size={20} />
            <span>{new Date(order?.created_at).toLocaleString('pt-BR')}</span>
          </div>
          <div className='flex items-center gap-2'>
            <CreditCard fill='' size={20} />
            <Badge className={`bg-[${statusColor}] text-white`}>
              {statusLabel}
            </Badge>
          </div>
          <div className='flex items-center gap-2'>
            <CircleDollarSign fill='' size={20} />
            <span>R$ {order?.total} (Produto + Frete)</span>
          </div>
        </div>
        <div className='h-[1px] w-full bg-k-default/50' />
      </div>
      <div className='mt-10 flex gap-5'>
        <TableProducts items={order?.items} />
        <Card>
          <CardHeader>
            <CardTitle>Pedido feito por: </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>Nome:</span>
              <span>
                {order?.customer?.first_name} {order?.customer?.last_name}
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>Email:</span>
              <span>{order?.customer?.email || 'Não Cadastrado'}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>Telefone:</span>
              <span>{order?.customer?.phone || 'Não Cadastrado'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrderDetails
