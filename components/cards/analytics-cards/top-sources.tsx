'use client'
import { getTopSourceAnalyticsFetch } from '@/actions/analytics/get-top-sources'
import { TopSourceChartExample } from '@/components/charts/examples/top-sources'
import { TopSourceChart } from '@/components/charts/top-sources'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import usePlausibleHook from '@/hooks/plausible-hook'
import { useShopifyIntegrationHook } from '@/hooks/shopify-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export function TopSourcesCard() {
  const { selectedStore } = useStoreHook()
  const { period, date } = usePlausibleHook()
  const { shopifyIntegration } = useShopifyIntegrationHook()
  const { ecommerceIntegration } = useEcommerceIntegrationHook()
  const queryClient = useQueryClient()

  const getHasPlatformIntegration = (): boolean => {
    switch (ecommerceIntegration?.type) {
      case 'shopify':
        return !!shopifyIntegration
    }
    return false
  }

  const { data, isPending, isError } = useQuery({
    queryKey: ['plausible-top-sources', selectedStore?.store_cod, period, date],
    retry: 0,
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await getTopSourceAnalyticsFetch({
        date: date,
        domain: shopifyIntegration?.domain,
        period: period,
      })

      if (!response?.data) {
        throw new Error('Failed to fetch data')
      }
      return response?.data
    },
    enabled:
      !!selectedStore?.store_cod &&
      !!period &&
      !!date &&
      getHasPlatformIntegration(),
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isError) {
      queryClient.setQueryDefaults(
        ['plausible-top-sources', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isError])

  const isEmpty = data?.results?.length === 0

  return (
    <>
      {!ecommerceIntegration ? (
        <div className='h-[430px] w-[420px]'>
          <div className='absolute z-50 flex h-[430px] w-[420px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] w-[420px] select-none blur-sm'>
            <CardHeader className='flex-col items-center justify-between space-y-0'>
              <div className='flex w-full items-center justify-between gap-2'>
                <h2 className='font-bold'>Principais Fontes de Acesso</h2>
              </div>
            </CardHeader>
            <CardContent>
              <TopSourceChartExample />
            </CardContent>
          </Card>
        </div>
      ) : isError ? (
        <div className='h-[430px] w-[420px]'>
          <div className='absolute z-50 flex h-[430px] w-[420px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] w-[420px] select-none blur-sm'>
            <CardHeader className='flex-col items-center justify-between space-y-0'>
              <div className='flex w-full items-center justify-between gap-2'>
                <h2 className='font-bold'>Principais Fontes de Acesso</h2>
              </div>
            </CardHeader>
            <CardContent>
              <TopSourceChartExample />
            </CardContent>
          </Card>
        </div>
      ) : isPending ? (
        <div className='h-[430px] w-[420px]'>
          <Card className='h-[430px] w-[420px]'>
            <CardContent className='flex h-[430px] flex-col items-center justify-center'>
              <div
                className='border-gray-200 h-10 w-10 animate-spin rounded-full border-4 border-t-4'
                style={{ borderTopColor: '#19dbfe' }}
              />
            </CardContent>
          </Card>
        </div>
      ) : isEmpty ? (
        <div className='h-[430px] w-[420px]'>
          <Card className='h-[430px] w-[420px]'>
            <CardHeader className='flex-col items-center justify-between space-y-0'>
              <div className='flex w-full items-center justify-between gap-2'>
                <h2 className='font-bold'>Principais Fontes de Acesso </h2>
              </div>
            </CardHeader>
            <div className='mt-5 flex h-60 w-full flex-col items-center justify-center'>
              <ExclamationTriangleIcon
                className='h-8 w-8'
                fill='#9fa3a6'
                color='#9fa3a6'
              />
              <span className='mt-4 text-sm text-muted-foreground'>
                Sem dados no período selecionado
              </span>
            </div>
          </Card>
        </div>
      ) : (
        <Card className='h-[430px] w-[420px]'>
          <CardHeader className='flex-col items-center justify-between space-y-0'>
            <div className='flex w-full items-center justify-between gap-2'>
              <h2 className='font-bold'>Principais Fontes de Acesso</h2>
            </div>
          </CardHeader>
          <CardContent>
            <TopSourceChart data={data?.results} />
          </CardContent>
        </Card>
      )}
    </>
  )
}
