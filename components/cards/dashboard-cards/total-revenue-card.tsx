'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { SwitchCards } from '@/components/ui/switch-cards'
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { ShoppingCart, TrendingUpIcon } from 'lucide-react'
import { GrCircleAlert } from 'react-icons/gr'
import { Bar, BarChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardFooter, CardHeader } from '../../ui/card'

export function TotalRevenueCard() {
  const stat = {
    chart: [
      { name: 'Janeiro', sale: 30 },
      { name: 'Fev', sale: 45 },
      { name: 'Mar', sale: 70 },
      { name: 'Abr', sale: 50 },
      { name: 'Mai', sale: 100 },
      { name: 'Jun', sale: 85 },
      { name: 'Jul', sale: 65 },
    ],
    fill: '#19dbfe',
  }

  const totalRevenue = 50000;
  const totalPaidOrders = 30000;
  const totalPendingOrders = 10000;
  const totalCancelledOrders = 5000;
  const totalRefundedOrders = 5000;



  return (
    <Card className='flex h-96 w-80 flex-col md:h-auto md:w-[360px] lg:w-full lg:min-w-80'>
      <CardHeader className='flex h-28 w-80 flex-col justify-between md:w-full'>
        <div className='mt-5 flex flex-col items-center justify-between gap-3 lg:flex-col'>
          <div className='mb-1 flex w-full flex-row items-center justify-between'>
            <div className='flex items-center gap-3'>
              <ShoppingCart className='h-6 w-6' />
            </div>
            <div className='flex w-full cursor-pointer items-center justify-end gap-2 text-xs text-muted-foreground underline'>
              <span>Mais Informações</span>
              <GrCircleAlert size={15} />
            </div>
          </div>
          <hr className='h-[0.125rem] w-full bg-kirofy-default' />
        </div>
      </CardHeader>
      <CardContent className='flex w-full flex-row flex-wrap items-center justify-between'>
        <div className='flex flex-col'>
          <p>Faturamento Total (R$)</p>
          <div className='flex items-center gap-2 text-2xl'>
            <span className='text-[20px] font-bold text-kirofy-default'>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalRevenue)}
            </span>
            <TrendingUpIcon fill='#ffeb3b' color='#ffeb3b' />
          </div>
        </div>
        <ResponsiveContainer width='30%' height={60} className='md:w-[40%]'>
          <BarChart barSize={10} data={stat.chart}>
            <Bar dataKey='sale' fill={stat.fill} radius={1} />
          </BarChart>
        </ResponsiveContainer>
        <hr className='mt-6 h-[0.125rem] w-full bg-kirofy-default' />
      </CardContent>
      <CardFooter className='flex flex-col'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <SwitchCards checked={true} className='cursor-default' />
            <span>Pagos:</span>
          </div>
          <span className='font-bold'>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaidOrders)}</span>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <SwitchCards checked={true} className='cursor-default' />
            <span>Pendentes:</span>
          </div>
          <span className='font-bold'>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendingOrders)}</span>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <SwitchCards checked={true} className='cursor-default' />
            <span>Cancelados:</span>
          </div>
          <span className='font-bold'>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCancelledOrders)}</span>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <SwitchCards checked={true} className='cursor-default' />
            <span>Reembolsados:</span>
          </div>
          <span className='font-bold'>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRefundedOrders)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}