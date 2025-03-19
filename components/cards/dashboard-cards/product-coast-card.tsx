'use client'
import { SheetDashboard } from '@/components/sheet/dashboard-sheet'
import { SwitchCards } from '@/components/ui/switch-cards'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { GrCircleAlert } from 'react-icons/gr'
import { Bar, BarChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardFooter, CardHeader } from '../../ui/card'

export function ProductCoastCard() {
  const [showSheet, setShowSheet] = useState(false)
  const [includeProductCosts, setIncludeProductCosts] = useState(true)

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
    fill: '#ffc107',
  }

  return (
    <div className='flex h-96 w-80 flex-col items-center justify-center md:h-auto md:w-[360px] lg:w-full lg:min-w-80'>
      <Card className='flex h-96 w-80 select-none flex-col md:h-auto md:w-[360px] lg:w-full lg:min-w-80'>
        <CardHeader className='flex h-28 w-80 flex-col justify-between md:w-full'>
          <div className='mt-5 flex flex-col items-center justify-between gap-3 lg:flex-col'>
            <div className='mb-1 flex w-full flex-row items-center justify-between'>
              <div className='flex items-center gap-3'>
                <ShoppingCart className='h-6 w-6' />
              </div>
              <div className='flex w-full items-center justify-end gap-2 text-xs text-muted-foreground underline'>
                <span>Mais Informações</span>
                <GrCircleAlert size={15} />
              </div>
            </div>
            <hr className='h-[2px] w-full bg-[#ffc107]' />
          </div>
        </CardHeader>
        <CardContent className='flex w-full flex-row flex-wrap items-center justify-between'>
          <div className='flex flex-col'>
            <p>Custos em Geral (R$)</p>
            <div className='flex items-center gap-2 text-2xl'>
              <span className='text-[20px] font-bold text-[#ffc107]'>
                R$ 5.000,00
              </span>
            </div>
          </div>
          <ResponsiveContainer width='30%' height={60} className='md:w-40%'>
            <BarChart barSize={10} data={stat.chart}>
              <Bar dataKey='sale' fill={stat.fill} radius={1} />
            </BarChart>
          </ResponsiveContainer>
          <hr className='mt-6 h-[2px] w-full bg-[#ffc107]' />
        </CardContent>
        <CardFooter className='flex flex-col'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-2'>
              <SwitchCards
                checked={includeProductCosts}
                onCheckedChange={() => setIncludeProductCosts(!includeProductCosts)}
              />
              <span>Custo dos produtos:</span>
            </div>
            <span className='font-bold'>R$ 3.500,00</span>
          </div>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-2'>
              <SwitchCards disabled />
              <span className='text-muted-foreground'>Frete:</span>
            </div>
            <span className='text-muted-foreground'>Em breve</span>
          </div>
          <div className='flex h-12 w-full items-center justify-between' />
        </CardFooter>
        <SheetDashboard open={showSheet} onOpenChange={setShowSheet} />
      </Card>
    </div>
  )
}