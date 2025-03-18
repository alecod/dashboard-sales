'use client'

export const timelineData = [
  {
    id: 1,
    title: 'Configurar Ambiente',
    date: '',
    description: '',
  },
  {
    id: 2,
    title: 'Integrar Shopify',
    date: '',
    description: '',
  },
  {
    id: 3,
    title: 'Integrar Facebook',
    date: '2022-03-01',
    description: '',
  },
]
import {
  Timeline,
  TimelineConnector,
  TimelineHeader,
  TimelineItem,
  TimelineTitle,
} from '@/components/timeline/timeline'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { cn } from '@/lib/utils'
import { routes } from '@/routes/routes'

import { useFacebookAdsDataHook } from '@/hooks/facebook-ads-data-hook'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '../header/logo'
import { SidebarToggle } from '../sidebar/sidebar-toggle'
import { Checkbox } from '../ui/checkbox'

export const TimelineLayout = ({
  items,
}: {
  items: Array<{
    id: number
    title: string
    date: string
    description: string
  }>
}) => {
  const [isOpen, setIsOpen] = useState(false)
  // Trazer os hooks
  const { ecommerceIntegration } = useEcommerceIntegrationHook()
  const { facebookAdsData } = useFacebookAdsDataHook()
  const { selectedStore } = useStoreHook()

  // Verificar os dados e marcar checkboxes
  const isStoreRegistered = !!selectedStore
  const isShopifyIntegrated = !!ecommerceIntegration
  const isFacebookIntegrated = !!facebookAdsData

  return (
    <aside
      className={cn(
        '0 fixed left-0 top-0 z-20 h-screen -translate-x-full bg-[#E2E3E4] transition-[width] duration-300 ease-in-out supports-[backdrop-filter]:bg-[#E2E3E4] dark:bg-[#08171D] dark:supports-[backdrop-filter]:bg-[#08171D] lg:translate-x-0',
        isOpen === false ? 'w-[90px]' : 'w-72',
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className='dark:shadow-zinc-800 relative flex h-full flex-col overflow-hidden overflow-y-auto px-3 py-4 shadow-md'>
        <Link href={routes.dashboard} className='flex items-center gap-2'>
          <Logo />
        </Link>
        <Timeline>
          <TimelineItem className='w-34 max-w-34 mt-5 block overflow-hidden'>
            <TimelineConnector />
            <TimelineHeader>
              <Checkbox
                checked={isStoreRegistered}
                className='h-7 w-7 cursor-default rounded-full bg-green-1'
              />
              <TimelineTitle>{items[0].title}</TimelineTitle>
            </TimelineHeader>
          </TimelineItem>
          <TimelineItem className='w-34 max-w-34 block overflow-hidden'>
            <TimelineConnector />
            <TimelineHeader>
              <Checkbox
                checked={isShopifyIntegrated}
                className='h-7 w-7 cursor-default rounded-full'
              />
              <TimelineTitle>{items[1].title}</TimelineTitle>
            </TimelineHeader>
          </TimelineItem>
          <TimelineItem className='w-34 max-w-34 block overflow-hidden'>
            <TimelineHeader>
              <Checkbox
                checked={isFacebookIntegrated}
                className='h-7 w-7 cursor-default rounded-full'
              />
              <TimelineTitle>{items[2].title}</TimelineTitle>
            </TimelineHeader>
          </TimelineItem>
        </Timeline>
      </div>
    </aside>
  )
}
