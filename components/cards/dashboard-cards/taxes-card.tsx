'use client'
import { Card, CardContent, CardFooter, CardHeader } from '../../ui/card'
import { SwitchCards } from '@/components/ui/switch-cards'
import { DollarSign } from 'lucide-react'
import { GrCircleAlert } from 'react-icons/gr'

export function TaxesCard() {
  // Dados estáticos para apresentação
  const totalTaxes = 1500.75;
  const dashboardTaxes = {
    invoicing: 500.25,
    checkout: 600.50,
    gateway: 400.00,
  };

  return (
    <Card className='flex h-96 w-80 flex-col md:h-auto md:w-[360px] lg:w-full lg:min-w-80'>
      <CardHeader className='flex h-28 w-80 flex-col justify-between md:w-full'>
        <div className='mt-5 flex flex-col items-center justify-between gap-3 lg:flex-col'>
          <div className='mb-1 flex w-full flex-row items-center justify-between'>
            <div className='flex items-center gap-3'>
              <DollarSign className='h-6 w-6' />
            </div>
            <div className='flex w-full items-center justify-end gap-2 text-xs text-muted-foreground underline'>
              <span>Mais Informações</span>
              <GrCircleAlert size={15} />
            </div>
          </div>
          <hr className='h-[2px] w-full bg-[#bd2130]' />
        </div>
      </CardHeader>
      <CardContent className='flex w-full flex-row flex-wrap items-center justify-between'>
        <div className='flex flex-col'>
          <p>Total de Taxas e Impostos (R$)</p>
          <div className='flex items-center gap-2 text-2xl'>
            <span className='text-[20px] font-bold text-[#bd2130]'>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalTaxes)}
            </span>
          </div>
        </div>
        <hr className='mt-6 h-[2px] w-full bg-[#bd2130]' />
      </CardContent>
      <CardFooter className='flex flex-col'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <SwitchCards checked className='cursor-default' />
            <span>Impostos</span>
          </div>
          <span className='font-bold'>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardTaxes.invoicing)}
          </span>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <SwitchCards checked className='cursor-default' />
            <span>Checkout</span>
          </div>
          <span className='font-bold'>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardTaxes.checkout)}
          </span>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <SwitchCards checked className='cursor-default' />
            <span>Gateway</span>
          </div>
          <span className='font-bold'>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardTaxes.gateway)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}