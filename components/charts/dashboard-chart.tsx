


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useDashboardHook } from '@/hooks/dashboard-hook'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import { routes } from '@/routes/routes'
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Skeleton } from '../ui/skeleton'

// Configuração do gráfico com tradução para português
const chartConfig = {
  total_orders: {
    label: 'Total de Pedidos',
    color: 'hsl(var(--chart-1))',
  },
  total_paid: {
    label: 'Total Pago',
    color: 'hsl(var(--chart-2))',
  },
  total_pending: {
    label: 'Total Pendente',
    color: 'hsl(var(--chart-3))',
  },
  total_cancelled: {
    label: 'Cancelado',
    color: 'hsl(var(--chart-4))',
  },
  total_refunded: {
    label: 'Reembolsado',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

export function DashboardChart({
  isError,
  isLoading,
}: {
  isError: boolean
  isLoading: boolean
}) {
  const { shopifyDashboardData, isLoadingShopifyDashboardData } =
    useDashboardHook()
  const { ecommerceIntegration } = useEcommerceIntegrationHook()

  const [selectedData, setSelectedData] = useState<'orders' | 'invoicing'>(
    'orders',
  )

  const chartData = shopifyDashboardData?.days
    ? selectedData === 'orders'
      ? shopifyDashboardData.days.map((day) => ({
          date: day.date,
          total: day.orders.total,
          paid: day.orders.paid,
          pending: day.orders.pending,
          cancelled: day.orders.cancelled,
          refunded: day.orders.refunded,
        }))
      : shopifyDashboardData.days.map((day) => ({
          date: day.date,
          total: Number.parseFloat(day.invoicing.total.replace(',', '')),
          paid: Number.parseFloat(day.invoicing.paid.replace(',', '')),
          pending: Number.parseFloat(day.invoicing.pending.replace(',', '')),
          cancelled:
            Number.parseFloat(day.invoicing.cancelled.replace(',', '')) || 0,
          refunded:
            Number.parseFloat(day.invoicing.refunded.replace(',', '')) || 0,
        }))
    : null

  const chartDataExample = [
    {
      date: '01/01/2022',
      total: 200,
      paid: 150,
      pending: 50,
      cancelled: 0,
      refunded: 0,
    },
    {
      date: '01/02/2022',
      total: 300,
      paid: 250,
      pending: 50,
      cancelled: 0,
      refunded: 0,
    },
    {
      date: '01/03/2022',
      total: 500,
      paid: 400,
      pending: 100,
      cancelled: 0,
      refunded: 0,
    },
    {
      date: '01/04/2022',
      total: 700,
      paid: 600,
      pending: 100,
      cancelled: 0,
      refunded: 0,
    },
    {
      date: '01/05/2022',
      total: 1000,
      paid: 850,
      pending: 150,
      cancelled: 0,
      refunded: 0,
    },
  ]

  return (
    <>

        <div className='flex h-auto w-full flex-col md:w-full lg:h-[33rem] lg:min-w-80'>
     
          <Card className='w-full  md:h-full lg:h-[33rem] lg:w-[37.5rem] xl:w-full'>
            <CardHeader className='flex w-full flex-col items-center justify-between p-5 sm:flex-row md:flex-row lg:flex-row'>
              <div>
                <CardTitle className='text-[1rem] font-bold lg:text-[1.2rem]'>
                  Total de Pedidos, Pagos, Pendentes, Cancelados e Reembolsados
                </CardTitle>
                <CardDescription className='mb-2 mt-2'>
                  Este gráfico mostra os dados entre faturamento e pedidos
                </CardDescription>
              </div>

              <div className='w-full sm:w-full md:w-36 lg:w-36'>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o tipo de gráfico' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='orders'>Pedidos</SelectItem>
                      <SelectItem value='invoicing'>Faturamento</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className='w-[19.5rem] md:w-full'>
              <ChartContainer
                config={chartConfig}
                className='h-80 w-80 sm:w-80 md:w-full lg:h-[26rem] lg:w-[37.5rem] xl:w-full'
              >
                <AreaChart
                  accessibilityLayer
                  data={chartDataExample}
                  className='relative right-[1.25rem]'
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='date'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={15}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    }
                  />
                  <YAxis domain={[0, 'auto']} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                    animationEasing='ease'
                  />
                  <defs className='p-10'>
                    <linearGradient
                      id='fillTotalPaid'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='5%' stopColor='#28a745' stopOpacity={0.8} />
                      <stop
                        offset='95%'
                        stopColor='#28a745'
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id='fillTotalPending'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='5%' stopColor='#ffc107' stopOpacity={0.8} />
                      <stop
                        offset='95%'
                        stopColor='#ffc107'
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id='fillTotalOrders'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='5%' stopColor='#19dbfe' stopOpacity={0.8} />
                      <stop
                        offset='95%'
                        stopColor='#19dbfe'
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id='fillCancelled'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='5%' stopColor='#ff4d4f' stopOpacity={0.8} />
                      <stop
                        offset='95%'
                        stopColor='#ff4d4f'
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id='fillRefunded'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='5%' stopColor='#fff' stopOpacity={0.8} />
                      <stop offset='95%' stopColor='#fff' stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <Area
                    dataKey='refunded'
                    type='monotone'
                    fill='url(#fillRefunded)'
                    fillOpacity={0.4}
                    stroke='#fff'
                  />
                  <Area
                    dataKey='cancelled'
                    type='monotone'
                    fill='url(#fillCancelled)'
                    fillOpacity={0.4}
                    stroke='#ff4d4f'
                  />
                  <Area
                    dataKey='pending'
                    type='monotone'
                    fill='url(#fillTotalPending)'
                    fillOpacity={0.4}
                    stroke='#ffc107'
                  />
                  <Area
                    dataKey='paid'
                    type='monotone'
                    fill='url(#fillTotalPaid)'
                    fillOpacity={0.4}
                    stroke='#28a745'
                  />
                  <Area
                    dataKey='total'
                    type='monotone'
                    fill='url(#fillTotalOrders)'
                    fillOpacity={0.4}
                    stroke='#19dbfe'
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      
    </>
  )
}
