'use client'
import { getVisitorsAnalyticsFetch } from '@/actions/analytics/get-visitors'
import { VisitorsChartExample } from '@/components/charts/examples/visitors-chart'
import { VisitorsChart } from '@/components/charts/visitors-chart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import usePlausibleHook from '@/hooks/plausible-hook'
import { useShopifyIntegrationHook } from '@/hooks/shopify-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function VisitorsCard() {
  const { selectedStore } = useStoreHook()
  const { period, date, interval, setMetric } = usePlausibleHook()
  const [selectedMetric, setSelectedMetric] = useState('visitors')
  const { shopifyIntegration } = useShopifyIntegrationHook()
  const { ecommerceIntegration } = useEcommerceIntegrationHook()
  const queryClient = useQueryClient()

  const metricTitles: Record<string, string> = {
    visitors: 'Visitantes Únicos',
    visits: 'Total de Visitas',
    pageviews: 'Total de Visualizações de Página',
    bounce_rate: 'Taxas de Rejeição',
    views_per_visit: 'Visualizações por Visita',
    visit_duration: 'Tempo de Visualização',
  }

  const getHasPlatformIntegration = (): boolean => {
    switch (ecommerceIntegration?.type) {
      case 'shopify':
        return !!shopifyIntegration
    }
    return false
  }

  const { data, isPending, isError } = useQuery({
    queryKey: ['plausible-visitors', period, date, interval, selectedMetric],
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await getVisitorsAnalyticsFetch({
        date: date,
        domain: shopifyIntegration?.domain,
        period: period,
        interval: interval,
        selectedMetric: selectedMetric,
      })
      if (!response?.data) {
        throw new Error('Erro ao buscar dados da API Plausible')
      }
      return await response?.data
    },
    enabled:
      !!selectedStore?.store_cod &&
      !!period &&
      !!date &&
      !!interval &&
      !!selectedMetric &&
      getHasPlatformIntegration(),
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isError) {
      queryClient.setQueryDefaults(
        ['plausible-visitors', period, date, interval, selectedMetric],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isError])

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric)
    setMetric(metric)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setMetric('visitors')
  }, [data])

  const isDataEmpty = data?.length === 0

  return (
    <>
      {!ecommerceIntegration ? (
        <div className='h-[430px] w-full'>
          <div className='absolute z-50 flex h-[431px] w-[800px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] w-full select-none blur-sm'>
            <CardHeader className='flex-row items-center gap-3 overflow-x-auto'>
              <div className='flex w-full items-center gap-2'>
                <h2>{metricTitles[selectedMetric]}</h2>
              </div>
              <div className='w-56'>
                <Select onValueChange={handleMetricChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='visitors'>
                        Visitantes Únicos
                      </SelectItem>
                      <SelectItem value='visits'>Total de Visitas</SelectItem>
                      <SelectItem value='pageviews'>
                        Total de Visualizações de Página
                      </SelectItem>
                      <SelectItem value='bounce_rate'>
                        Taxas de Rejeição
                      </SelectItem>
                      <SelectItem value='views_per_visit'>
                        Visualizações por Visita
                      </SelectItem>
                      <SelectItem value='visit_duration'>
                        Tempo de Visualização
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className='mt-10'>
              <VisitorsChartExample />
            </CardContent>
          </Card>
        </div>
      ) : isError ? (
        <div className='h-[430px] w-full'>
          <div className='absolute z-50 flex h-[430px] w-[1100px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] w-full select-none blur-sm'>
            <CardHeader className='flex-row items-center gap-3 overflow-x-auto'>
              <div className='flex w-full items-center gap-2'>
                <h2>{metricTitles[selectedMetric]}</h2>
              </div>
              <div className='w-56'>
                <Select onValueChange={handleMetricChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='visitors'>
                        Visitantes Únicos
                      </SelectItem>
                      <SelectItem value='visits'>Total de Visitas</SelectItem>
                      <SelectItem value='pageviews'>
                        Total de Visualizações de Página
                      </SelectItem>
                      <SelectItem value='bounce_rate'>
                        Taxas de Rejeição
                      </SelectItem>
                      <SelectItem value='views_per_visit'>
                        Visualizações por Visita
                      </SelectItem>
                      <SelectItem value='visit_duration'>
                        Tempo de Visualização
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className='mt-10'>
              <VisitorsChartExample />
            </CardContent>
          </Card>
        </div>
      ) : isPending ? (
        <div className='h-[430px] w-full'>
          <Card className='h-[430px] w-full'>
            <CardContent className='flex h-full flex-col items-center justify-center'>
              <div
                className='border-gray-200 h-10 w-10 animate-spin rounded-full border-4 border-t-4'
                style={{ borderTopColor: '#19dbfe' }}
              />
            </CardContent>
          </Card>
        </div>
      ) : isDataEmpty ? (
        <Card className='h-[430px] w-full'>
          <CardContent className='mt-10'>
            <ExclamationTriangleIcon className='text-gray-400 h-20 w-12' />
            <span className='mt-4 text-sm text-muted-foreground'>
              Sem dados no período selecionado
            </span>
          </CardContent>
        </Card>
      ) : (
        <Card className='h-[430px] w-full'>
          <CardHeader className='flex-row items-center gap-3 overflow-x-auto'>
            <div className='flex w-full items-center gap-2'>
              <h2 className=''>{metricTitles[selectedMetric]}</h2>
            </div>
            <div className='w-56'>
              <Select onValueChange={handleMetricChange}>
                <SelectTrigger>
                  <SelectValue placeholder={metricTitles[selectedMetric]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='visitors'>Visitantes Únicos</SelectItem>
                    <SelectItem value='visits'>Total de Visitas</SelectItem>
                    <SelectItem value='pageviews'>
                      Total de Visualizações de Página
                    </SelectItem>
                    <SelectItem value='bounce_rate'>
                      Taxas de Rejeição
                    </SelectItem>
                    <SelectItem value='views_per_visit'>
                      Visualizações por Visita
                    </SelectItem>
                    <SelectItem value='visit_duration'>
                      Tempo de Visualização
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className='mt-10'>
            <VisitorsChart data={data} />
          </CardContent>
        </Card>
      )}
    </>
  )
}
