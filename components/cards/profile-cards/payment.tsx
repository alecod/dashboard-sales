import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PaymentCard() {
  return (
    <Card className='w-[550px]'>
      <CardHeader>
        <CardTitle>Minha Assinatura</CardTitle>
      </CardHeader>
      <CardContent className='flex'>
        <div className='flex w-60 flex-col border-r border-x-k-white'>
          <div>
            <p className='text-sm'>
              <span className='font-bold text-muted-foreground'>Plano: </span>
              Advanced - k
            </p>
          </div>
          <div className='mt-1'>
            <p className='text-sm'>
              <span className='font-bold text-muted-foreground'>
                Data de assinatura:{' '}
              </span>
              26/09/2024
            </p>
          </div>
          <div className='mt-1'>
            <p className='text-sm'>
              <span className='font-bold text-muted-foreground'>
                Proxima Fatura:{' '}
              </span>
              26/10/2024
            </p>
          </div>
          <div className='mt-1'>
            <p className='text-sm'>
              <span className='font-bold text-muted-foreground'>Valor: </span>
              R$347,90
            </p>
          </div>
        </div>
        <div className='pl-10'>
          <span className='font-bold'>Sua Assinatura inclui:</span>
          <div className='mt-2'>
            <p className='text-sm'>- 150 Vendas no mês</p>
            <p className='text-sm'>- Integração com a Shopify</p>
            <p className='text-sm'>- Integração com Facebook Ads</p>
            <p className='text-sm'>- Facebook Pixel</p>
            <p className='text-sm'>- Gerenciamento de taxas e impostos</p>
            <p className='text-sm'>- k Tracking</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
