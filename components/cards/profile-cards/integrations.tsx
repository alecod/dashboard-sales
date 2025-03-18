import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function IntegrationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações</CardTitle>
      </CardHeader>
      <CardContent className='flex'>
        <div className='flex w-60 flex-col border-r'>
          <div className='flex items-center gap-3'>
            <p className='text-sm font-bold text-muted-foreground'>
              Facebook Ads:
            </p>
            <div className='flex items-center justify-center gap-2'>
              <span>Ativo</span>
              <div className='h-3 w-3 animate-pulse rounded-full bg-green-1' />
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <p className='text-sm font-bold text-muted-foreground'>Shopify:</p>
            <div className='flex items-center justify-center gap-2'>
              <span>Ativo</span>
              <div className='h-3 w-3 animate-pulse rounded-full bg-green-1' />
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <p className='text-sm font-bold text-muted-foreground'>
              Google Ads:
            </p>
            <div className='flex items-center justify-center gap-2'>
              <span>Inativo</span>
              <div className='h-3 w-3 rounded-full bg-red-2' />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Gerenciar integrações</Button>
      </CardFooter>
    </Card>
  )
}
