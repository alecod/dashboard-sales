import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Dispatch, SetStateAction } from 'react'

interface SidebarToggleProps {
  isOpen: boolean | undefined
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className='invisible absolute -right-[15px] top-[21px] z-20 lg:visible'>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className='h-8 w-8 rounded-md'
        variant='outline'
        size='icon'
      >
        <ChevronLeft
          className={cn(
            'h-4 w-4 transition-transform duration-700 ease-in-out',
            isOpen === false ? 'rotate-180' : 'rotate-0',
          )}
        />
      </Button>
    </div>
  )
}
