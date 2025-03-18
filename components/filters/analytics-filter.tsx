'use client'
import { getUsersOnlineAnalyticsFetch } from '@/actions/analytics/get-users-online'
import { ENV } from '@/env/env-store'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import usePlausibleHook from '@/hooks/plausible-hook'
import { useShopifyIntegrationHook } from '@/hooks/shopify-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { UtmBuilderSheet } from '../sheet/utm-builder'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export function FilterAnalytics() {
  const [open, setOpen] = useState(false)

  const { setPeriodAndDate, period, date } = usePlausibleHook()
  const [selectedPeriod, setSelectedPeriod] = useState('4')

  const { selectedStore } = useStoreHook()
  const { shopifyIntegration } = useShopifyIntegrationHook()
  const { ecommerceIntegration } = useEcommerceIntegrationHook()
  const { API_URL, PLAUSIBLE_TOKEN } = ENV()

  const getHasPlatformIntegration = (): boolean => {
    switch (ecommerceIntegration?.type) {
      case 'shopify':
        return !!shopifyIntegration
    }
    return false
  }

  useEffect(() => {
    setPeriodAndDate('7d')
  }, [setPeriodAndDate])

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value)

    let period = ''
    switch (value) {
      case '1':
        period = 'today'
        break
      case '2':
        period = 'day'
        break
      case '3':
        period = 'realtime'
        break
      case '4':
        period = '7d'
        break
      case '5':
        period = '30d'
        break
      case '6':
        period = 'month'
        break
      case '8':
        period = 'all'
        break
    }
    setPeriodAndDate(period)
  }

  const { data, isPending } = useQuery({
    queryKey: [
      'plausible-current-visitors-online',
      selectedStore?.store_cod,
      period,
      date,
    ],
    staleTime: Number.POSITIVE_INFINITY,
    retry: 0,
    queryFn: async () => {
      const response = await getUsersOnlineAnalyticsFetch({
        domain: shopifyIntegration?.domain,
      })
      if (!response?.data) {
        throw new Error('Erro ao buscar dados da API Plausible')
      }
      return await response.data
    },
    enabled:
      !!selectedStore?.store_cod &&
      !!period &&
      !!date &&
      getHasPlatformIntegration(),
  })

  return (
    <div className='mt-5 md:flex md:justify-between'>
      <div className='flex items-center gap-3 sm:w-full sm:justify-between md:justify-normal lg:w-auto'>
        <div className='flex items-end gap-3'>
         
          <span> Tracking</span>
        </div>
        <div className='ml-5 mt-1 flex items-center gap-2'>
          <div className='h-3 w-3 animate-pulse rounded-full bg-green-1' />
          <span className='text-xs text-muted-foreground'>
            {data?.toString() || '0'} usuarios online
          </span>
        </div>
      </div>
      <div className='mt-5 flex w-full justify-between gap-5 md:mb-5 md:w-80'>
        <Button
          variant='outline'
          className='mt-6'
          onClick={() => setOpen(true)}
        >
          Gerarador de UTMs
        </Button>
        <UtmBuilderSheet open={open} onOpenChange={setOpen} />
        <div className='flex flex-col'>
          <Label className='text-gray-600 mb-2 text-xs'>
            Selecione o Peiodo:
          </Label>
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className='w-full'>
              <SelectValue
                placeholder={selectedPeriod === '4' ? 'Últimos 7 Dias' : ''}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='1'>Hoje</SelectItem>
                <SelectItem value='2'>Ontem</SelectItem>
                <SelectItem value='3' disabled>
                  Tempo Real (Em Breve)
                </SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectItem value='4'>Últimos 7 Dias</SelectItem>
                <SelectItem value='5'>Últimos 30 Dias</SelectItem>
                <SelectItem value='6'>Do Mês até a Data Atual</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectItem value='8'>Todo o Periodo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
