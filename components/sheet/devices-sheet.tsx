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

import { FaChrome, FaEdge, FaOpera, FaSafari } from 'react-icons/fa'
import { GrFirefox } from 'react-icons/gr'

export function DevicesSheet() {
  return (
    <Sheet>
      <SheetOverlay className='flex items-center justify-center bg-k-black bg-opacity-50 backdrop-blur-md' />
      <SheetTrigger asChild>
        <Button variant='link'>Mais informações</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Dispositivos</SheetTitle>
        </SheetHeader>
        <div className='mt-5 flex flex-col'>
          <div className='flex items-center justify-between border-b border-k-default/10 pb-3'>
            <span className='text-sm text-muted-foreground'>Navegadores</span>
            <div className='flex gap-3'>
              <span className='text-sm text-muted-foreground'>Visitantes</span>
              <span className='text-sm text-muted-foreground'>%</span>
            </div>
          </div>
          <div className='mt-5 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FaChrome />
              <span>Google Chrome</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>1200</span>
              <span>45%</span>
            </div>
          </div>

          <div className='mt-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <GrFirefox />
              <span>Monzila Firefox</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>800</span>
              <span>35%</span>
            </div>
          </div>

          <div className='mt-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FaEdge />
              <span>Microsoft Edge</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>800</span>
              <span>35%</span>
            </div>
          </div>

          <div className='mt-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FaSafari />
              <span>Safari</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>800</span>
              <span>35%</span>
            </div>
          </div>
          <div className='mt-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FaOpera />
              <span>Opera</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>800</span>
              <span>35%</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
