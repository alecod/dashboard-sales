'use client'
import { SheetDashboard } from '@/components/sheet/dashboard-sheet'
import { SwitchCards } from '@/components/ui/switch-cards'
import { Megaphone, TrendingUpIcon } from 'lucide-react'
import { useState } from 'react'
import { GrCircleAlert } from 'react-icons/gr'
import { Bar, BarChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardFooter, CardHeader } from '../../ui/card'

export function MarketingCoastCard() {
  const [showSheet, setShowSheet] = useState(false)
  const [includeFacebookAds, setIncludeFacebookAds] = useState(true)

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
    fill: '#70c08b',
  }

  return (
    <Card className='flex h-96 w-80 flex-col md:h-auto md:w-[360px] lg:w-full lg:min-w-80'>
      <CardHeader className='flex h-28 w-80 flex-col justify-between md:w-full'>
        <div className='mt-5 flex flex-col items-center justify-between gap-3 lg:flex-col'>
          <div className='mb-1 flex w-full flex-row items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Megaphone className='h-6 w-6' />
            </div>
            <div className='flex w-full items-center justify-end gap-2 text-xs text-muted-foreground underline'>
              <span>Mais Informações</span>
              <GrCircleAlert size={15} />
            </div>
          </div>
          <hr className='h-[2px] w-full bg-[#70c08b]' />
        </div>
      </CardHeader>
      <CardContent className='flex w-full flex-row flex-wrap items-center justify-between'>
        <div className='flex flex-col'>
          <p>Custos de Marketing (R$)</p>
          <div className='flex items-center gap-2 text-2xl'>
            <span className='text-[20px] font-bold text-[#70c08b]'>R$ 5.000,00</span>
            <TrendingUpIcon fill='#ffeb3b' color='#ffeb3b' />
          </div>
        </div>
        <ResponsiveContainer width='30%' height={60} className='md:w-40%'>
          <BarChart barSize={10} data={stat.chart}>
            <Bar dataKey='sale' fill={stat.fill} radius={1} />
          </BarChart>
        </ResponsiveContainer>
        <hr className='mt-6 h-[2px] w-full bg-[#70c08b]' />
      </CardContent>
      <CardFooter className='flex flex-col'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <SwitchCards checked={includeFacebookAds} onCheckedChange={setIncludeFacebookAds} />
            <span>Facebook Ads:</span>
          </div>
          <span className='font-bold'>R$ 2.500,00</span>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <SwitchCards disabled />
            <span className='text-muted-foreground'>TikTok Ads:</span>
          </div>
          <span className='text-muted-foreground'>Em breve</span>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <SwitchCards disabled />
            <span className='text-muted-foreground'>Google Ads:</span>
          </div>
          <span className='text-muted-foreground'>Em breve</span>
        </div>
      </CardFooter>
      <SheetDashboard open={showSheet} onOpenChange={setShowSheet} />
    </Card>
  )
}
