import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function TopSourceSheet() {
  return (
    <Sheet>
      <SheetOverlay className='flex items-center justify-center bg-kirofy-black bg-opacity-50 backdrop-blur-md' />
      <SheetTrigger asChild>
        <Button variant='link'>Mais informações</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Principais Fontes de Acesso</SheetTitle>
        </SheetHeader>
        <div className='mt-5 flex flex-col'>
          <div className='flex items-center justify-between border-b border-kirofy-default/10 pb-3'>
            <span className='text-sm text-muted-foreground'>Origem</span>
            <div className='flex gap-3'>
              <span className='text-sm text-muted-foreground'>Visitantes</span>
            </div>
          </div>
          <div className='mt-5 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span>Direto</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>1200</span>
            </div>
          </div>

          <div className='mt-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span>Google</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>800</span>
            </div>
          </div>

          <div className='mt-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span>Github</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>800</span>
            </div>
          </div>

          <div className='mt-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span>Bing</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>800</span>
            </div>
          </div>
          <div className='mt-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span>ChatGPT</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>800</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
