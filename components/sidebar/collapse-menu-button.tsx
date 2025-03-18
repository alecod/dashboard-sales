import { ChevronDown, Dot, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

type Submenu2 = {
  href: string
  label: string
  active: boolean
  icon?: LucideIcon
}

type Submenu = {
  href: string
  label: string
  active: boolean
  icon?: LucideIcon
  sub?: Submenu2[] // Submenu aninhado
}

type CollapseMenuButtonProps = {
  icon: LucideIcon
  label: string
  active: boolean | undefined
  submenus: Submenu[] | undefined
  isOpen: boolean | undefined
}

export function CollapseMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen,
}: CollapseMenuButtonProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Função para alternar o estado de colapso do submenu
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Função para renderizar submenus aninhados
  const renderSubSubmenus = (sub: Submenu2[] | undefined) => {
    if (!sub || sub.length === 0) return null

    return sub.map(({ href, label, active }, index) => (
      <Button
        key={Number(index)}
        variant={active ? 'secondary' : 'ghost'}
        className='mb-1 ml-6 h-8 w-full justify-start'
        asChild
      >
        <Link href={href}>
          <span className='ml-2 mr-4' />
          <p className='truncate'>{label}</p>
        </Link>
      </Button>
    ))
  }

  return isOpen ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={handleToggle}
      className='w-full'
    >
      <CollapsibleTrigger asChild>
        <Button
          variant={active ? 'secondary' : 'ghost'}
          className='h-10 w-full justify-start'
        >
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center'>
              <span className='mr-4'>
                <Icon size={18} />
              </span>
              <p className={'max-w-[120px] truncate'}>{label}</p>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='overflow-hidden'>
        {submenus?.map(({ href, label, active, sub }, index) => (
          <div key={Number(index)}>
            <Button
              variant={active ? 'secondary' : 'ghost'}
              className='mb-1 h-8 w-full justify-start'
              asChild
            >
              <Link href={href}>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center'>
                    <span className='mr-4'>
                      <Dot size={18} />
                    </span>
                    <p className={cn('max-w-[120px] truncate')}>{label}</p>
                  </div>
                </div>
              </Link>
            </Button>
            {/* Renderiza subsubmenus se existirem */}
            {sub && renderSubSubmenus(sub)}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      className='mb-1 h-10 w-full justify-start'
      onClick={handleToggle}
    >
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center'>
          <span className='mr-4'>
            <Icon size={18} />
          </span>
          <p className={cn('relative left-2 max-w-[120px] truncate')}>
            {label}
          </p>
        </div>
      </div>
    </Button>
  )
}
