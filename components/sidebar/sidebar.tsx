'use client'

import { Menu } from '@/components/sidebar/menu'
import { SidebarToggle } from '@/components/sidebar/sidebar-toggle'
import { cn } from '@/lib/utils'
import { routes } from '@/routes/routes'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '../header/logo'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const handleMouseEnter = () => {
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    setIsOpen(false)
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 hidden h-screen -translate-x-full bg-[#E2E3E4] transition-[width] duration-300 ease-in-out supports-[backdrop-filter]:bg-[#E2E3E4] dark:bg-[#08171D] dark:supports-[backdrop-filter]:bg-[#08171D] md:block lg:translate-x-0',
        isOpen === false ? 'w-[90px]' : 'w-72',
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className='dark:shadow-zinc-800 relative flex h-full flex-col overflow-hidden overflow-y-auto px-3 py-4 shadow-md'>
        <Link href={routes.dashboard} className='flex items-center gap-2'>
          <Logo />
        </Link>
        <Menu isOpen={isOpen} />
      </div>
    </aside>
  )
}
