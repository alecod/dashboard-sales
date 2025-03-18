import { MenuIcon } from 'lucide-react'
import Link from 'next/link'

import { Menu } from '@/components/sidebar/menu'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import { routes } from '@/routes/routes'
import { Logo } from '../header/logo'

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden' asChild>
        <Button className='h-10' variant='outline' size='icon'>
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className='flex h-full flex-col bg-[#08171D] px-3 dark:supports-[backdrop-filter]:bg-[#08171D]'
        side='left'
      >
        <SheetHeader>
          <Link href={routes.dashboard} className='flex items-center gap-2'>
            <Logo />
          </Link>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  )
}
