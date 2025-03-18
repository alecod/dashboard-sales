'use client'
import { getBrowsersAnalyticsFetch } from '@/actions/analytics/get-browser'
import { getOsAnalyticsFetch } from '@/actions/analytics/get-os'
import { getSizesAnalyticsFetch } from '@/actions/analytics/get-sizes'
import { DevicesChart } from '@/components/charts/devices-chart'
import { DevicesChartExample } from '@/components/charts/examples/devices-chart'
import { OsChart } from '@/components/charts/os-chart'
import { SizesChart } from '@/components/charts/sizes-chart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import usePlausibleHook from '@/hooks/plausible-hook'
import { useShopifyIntegrationHook } from '@/hooks/shopify-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
export function DevicesCard() {
  const { shopifyIntegration } = useShopifyIntegrationHook()
  const { ecommerceIntegration } = useEcommerceIntegrationHook()
  const { selectedStore } = useStoreHook()
  const { period, date } = usePlausibleHook()
  const queryClient = useQueryClient()

  const [activeChart, setActiveChart] = useState<'devices' | 'os' | 'sizes'>(
    'devices',
  )

  const getChartQueryUrl = ({
    date,
    domain,
    period,
  }: {
    date: string
    domain: string
    period: string
  }) => {
    switch (activeChart) {
      case 'os':
        return getOsAnalyticsFetch({
          date: date,
          domain: shopifyIntegration?.domain,
          period: period,
        })
      case 'sizes':
        return getSizesAnalyticsFetch({
          date: date,
          domain: shopifyIntegration?.domain,
          period: period,
        })
      default:
        return getBrowsersAnalyticsFetch({
          date: date,
          domain: shopifyIntegration?.domain,
          period: period,
        })
    }
  }

  const getHasPlatformIntegration = (): boolean => {
    switch (ecommerceIntegration?.type) {
      case 'shopify':
        return !!shopifyIntegration
    }
    return false
  }

  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      'plausible-devices',
      selectedStore?.store_cod,
      period,
      date,
      activeChart,
    ],
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await getChartQueryUrl({
        domain: String(shopifyIntegration?.domain),
        period: period,
        date: date,
      })
      if (res && !res.data) {
        throw new Error('Error when logging in. check the data and try again')
      }
      return res?.data
    },
    enabled:
      !!selectedStore?.store_cod &&
      !!period &&
      !!date &&
      getHasPlatformIntegration(),
  })

  const isDataEmpty = data?.results?.length === 0

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isError) {
      queryClient.setQueryDefaults(
        [
          'plausible-devices',
          selectedStore?.store_cod,
          period,
          date,
          activeChart,
        ],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isError])

  return (
    <>
      {!ecommerceIntegration ? (
        <div className='h-[430px] w-[550px]'>
          <div className='absolute z-50 flex h-[430px] w-[550px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] w-[550px] select-none blur-sm'>
            <CardHeader className='flex-row items-center justify-between gap-5 space-y-0'>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'devices' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('devices')}
              >
                Navegadores
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'os' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('os')}
              >
                Sistema Operacional
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'sizes' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('sizes')}
              >
                Dispositivos
              </Button>
            </CardHeader>
            <CardContent>
              <DevicesChartExample />
            </CardContent>
          </Card>
        </div>
      ) : isError ? (
        <div className='h-[430px] w-[550px]'>
          <div className='absolute z-50 flex h-[430px] w-[550px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] w-[550px] select-none blur-sm'>
            <CardHeader className='flex-row items-center justify-between gap-5 space-y-0'>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'devices' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('devices')}
              >
                Navegadores
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'os' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('os')}
              >
                Sistema Operacional
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'sizes' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('sizes')}
              >
                Dispositivos
              </Button>
            </CardHeader>
            <CardContent>
              <DevicesChartExample />
            </CardContent>
          </Card>
        </div>
      ) : isPending ? (
        <div className='h-[430px] w-[550px]'>
          <Card className='h-[430px] w-[550px]'>
            <CardContent className='flex h-[430px] flex-col items-center justify-center'>
              <div
                className='border-gray-200 h-10 w-10 animate-spin rounded-full border-4 border-t-4'
                style={{ borderTopColor: '#19dbfe' }}
              />
            </CardContent>
          </Card>
        </div>
      ) : isDataEmpty ? (
        <div className='h-[430px] w-[550px]'>
          <Card className='h-[430px] w-[550px]'>
            <CardHeader className='flex-row items-center justify-between gap-5 space-y-0'>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'devices' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('devices')}
              >
                Navegadores
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'os' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('os')}
              >
                Sistema Operacional
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'sizes' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('sizes')}
              >
                Dispositivos
              </Button>
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
        <div className='h-[430px] w-[550px]'>
          <Card className='h-[430px] w-[550px]'>
            <CardHeader className='flex-row items-center justify-between gap-5 space-y-0'>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'devices' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('devices')}
              >
                Navegadores
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'os' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('os')}
              >
                Sistema Operacional
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeChart === 'sizes' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveChart('sizes')}
              >
                Dispositivos
              </Button>
            </CardHeader>
            <CardContent>
              {activeChart === 'devices' && (
                <DevicesChart data={data?.results} />
              )}
              {activeChart === 'os' && <OsChart data={data?.results} />}
              {activeChart === 'sizes' && <SizesChart data={data?.results} />}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
