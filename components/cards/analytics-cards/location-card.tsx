'use client'
import { getCitiesAnalyticsFetch } from '@/actions/analytics/get-cities'
import { getCountiresAnalyticsFetch } from '@/actions/analytics/get-countries'
import { getRegionsAnalyticsFetch } from '@/actions/analytics/get-regions'
import { MapChartExample } from '@/components/maps/examples/wordwide'
import { MapChartEmpity } from '@/components/maps/examples/worwide-empty'
import { MapChart } from '@/components/maps/wordwide'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ENV } from '@/env/env-store'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import usePlausibleHook from '@/hooks/plausible-hook'
import { useShopifyIntegrationHook } from '@/hooks/shopify-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Fragment, useEffect, useState } from 'react'
import Flag from 'react-world-flags'

export function LocationCard() {
  const [activeLocation, setActiveLocation] = useState<
    'paises' | 'estados' | 'cidades'
  >('paises')
  const { period, date } = usePlausibleHook()
  const { selectedStore } = useStoreHook()
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
    queryKey: ['plausible-countries', selectedStore?.store_cod, period, date],
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async (data) => {
      const res = await getCountiresAnalyticsFetch({
        date: date,
        domain: shopifyIntegration?.domain,
        period: period,
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

  const {
    data: statesData,
    isPending: isStatesPending,
    isError: isErrorStates,
  } = useQuery({
    queryKey: ['plausible-states', selectedStore?.store_cod, period, date],
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    refetchOnWindowFocus: false,
    queryFn: async (data) => {
      const res = await getRegionsAnalyticsFetch({
        date: date,
        domain: shopifyIntegration?.domain,
        period: period,
      })

      if (res && !res.data) {
        throw new Error('Error when logging in. check the data and try again')
      }

      return res?.data
    },
    enabled:
      activeLocation === 'estados' &&
      !!selectedStore?.store_cod &&
      !!period &&
      !!date &&
      getHasPlatformIntegration(),
  })

  const {
    data: citiesData,
    isPending: isCitiesPending,
    isError: isErrorCities,
  } = useQuery({
    queryKey: ['plausible-cities', selectedStore?.store_cod, period, date],
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async (data) => {
      const res = await getCitiesAnalyticsFetch({
        date: date,
        domain: shopifyIntegration?.domain,
        period: period,
      })

      if (res && !res.data) {
        throw new Error('Error when logging in. check the data and try again')
      }

      return res?.data
    },
    enabled:
      activeLocation === 'cidades' &&
      !!selectedStore?.store_cod &&
      !!period &&
      !!date &&
      getHasPlatformIntegration(),
  })
  // @ts-ignore
  const isDataEmpty = data?.results?.length === 0

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isError) {
      queryClient.setQueryDefaults(
        ['plausible-countries', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isError])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isErrorStates) {
      queryClient.setQueryDefaults(
        ['plausible-states', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isErrorStates])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isErrorCities) {
      queryClient.setQueryDefaults(
        ['plausible-cities', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isErrorCities])

  return (
    <>
      {!ecommerceIntegration ? (
        <div className='h-[430px] sm:w-auto lg:w-full'>
          <div className='absolute z-50 flex h-[430px] w-[900px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] select-none blur-sm sm:w-auto lg:w-full'>
            <CardHeader className='w-full flex-row items-center justify-between space-y-0'>
              <div className='flex w-[500px] items-center gap-3 lg:justify-between'>
                <h2 className='font-bold'>Localização</h2>
              </div>
              <div className='flex w-40 items-center justify-between'>
                <Button
                  variant='link'
                  className={`mt-0 p-0 text-xs ${activeLocation === 'paises' ? '' : 'text-muted-foreground'}`}
                  onClick={() => setActiveLocation('paises')}
                >
                  Paises
                </Button>
                <Button
                  variant='link'
                  className={`mt-0 p-0 text-xs ${activeLocation === 'estados' ? '' : 'text-muted-foreground'}`}
                  onClick={() => setActiveLocation('estados')}
                >
                  Estados
                </Button>
                <Button
                  variant='link'
                  className={`mt-0 p-0 text-xs ${activeLocation === 'cidades' ? '' : 'text-muted-foreground'}`}
                  onClick={() => setActiveLocation('cidades')}
                >
                  Cidades
                </Button>
              </div>
            </CardHeader>
            <CardContent className='flex'>
              <div className='relative bottom-7 border-r border-kirofy-default/50 sm:w-[420px] md:w-[500px]'>
                <MapChartExample />
              </div>

              <div className='flex w-full flex-col'>
                <header className='flex w-full justify-between pl-4'>
                  <span className='pl-3 text-sm text-muted-foreground'>
                    {activeLocation === 'paises' && 'Nome do País'}
                    {activeLocation === 'estados' && 'Nome do Estado'}
                    {activeLocation === 'cidades' && 'Nome da Cidade'}
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    Visitantes
                  </span>
                </header>

                {/* Renderização condicional dos dados com base na localização ativa */}
                {activeLocation === 'paises' && (
                  <div className='flex w-full flex-col pl-3'>
                    <div className='mt-3 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='usa' className='w-5' />
                        <span className='text-sm font-bold'>
                          Estados Unidos
                        </span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        6000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='br' className='w-5' />
                        <span className='text-sm font-bold'>Brasil</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='cn' className='w-5' />
                        <span className='text-sm font-bold'>China</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='ru' className='w-5' />
                        <span className='text-sm font-bold'>Russia</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='de' className='w-5' />
                        <span className='text-sm font-bold'>Alemanha</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='fr' className='w-5' />
                        <span className='text-sm font-bold'>França</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='mx' className='w-5' />
                        <span className='text-sm font-bold'>Mexico</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                  </div>
                )}

                {activeLocation === 'estados' && (
                  <div className='flex w-full flex-col pl-3'>
                    <div className='mt-3 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>São Paulo</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        6000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>
                          Rio de Janeiro
                        </span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Paraná</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>
                          Santa Catarina
                        </span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>
                          Mato Grosso do Sul
                        </span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Minas Gerais</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Bahia</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                  </div>
                )}

                {activeLocation === 'cidades' && (
                  <div className='flex w-full flex-col pl-3'>
                    <div className='mt-3 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Londrina</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        6000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Maringá</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Pinhais</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>
                          São Jose dos Pinhais
                        </span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Curitiba</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Pato Branco</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Foz do Iguaçu</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : isError ? (
        <div className='h-[430px] sm:w-auto lg:w-full'>
          <div className='absolute z-50 flex h-[430px] w-[1100px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] select-none blur-sm sm:w-auto lg:w-full'>
            <CardHeader className='w-full flex-row items-center justify-between space-y-0'>
              <div className='flex w-[500px] items-center gap-3 lg:justify-between'>
                <h2 className='font-bold'>Localização</h2>
              </div>
              <div className='flex w-40 items-center justify-between'>
                <Button
                  variant='link'
                  className={`mt-0 p-0 text-xs ${activeLocation === 'paises' ? '' : 'text-muted-foreground'}`}
                  onClick={() => setActiveLocation('paises')}
                >
                  Paises
                </Button>
                <Button
                  variant='link'
                  className={`mt-0 p-0 text-xs ${activeLocation === 'estados' ? '' : 'text-muted-foreground'}`}
                  onClick={() => setActiveLocation('estados')}
                >
                  Estados
                </Button>
                <Button
                  variant='link'
                  className={`mt-0 p-0 text-xs ${activeLocation === 'cidades' ? '' : 'text-muted-foreground'}`}
                  onClick={() => setActiveLocation('cidades')}
                >
                  Cidades
                </Button>
              </div>
            </CardHeader>
            <CardContent className='flex'>
              <div className='relative bottom-7 border-r border-kirofy-default/50 sm:w-[420px] md:w-[500px]'>
                <MapChartExample />
              </div>

              <div className='flex w-full flex-col'>
                <header className='flex w-full justify-between pl-4'>
                  <span className='pl-3 text-sm text-muted-foreground'>
                    {activeLocation === 'paises' && 'Nome do País'}
                    {activeLocation === 'estados' && 'Nome do Estado'}
                    {activeLocation === 'cidades' && 'Nome da Cidade'}
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    Visitantes
                  </span>
                </header>

                {/* Renderização condicional dos dados com base na localização ativa */}
                {activeLocation === 'paises' && (
                  <div className='flex w-full flex-col pl-3'>
                    <div className='mt-3 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='usa' className='w-5' />
                        <span className='text-sm font-bold'>
                          Estados Unidos
                        </span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        6000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='br' className='w-5' />
                        <span className='text-sm font-bold'>Brasil</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='cn' className='w-5' />
                        <span className='text-sm font-bold'>China</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='ru' className='w-5' />
                        <span className='text-sm font-bold'>Russia</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='de' className='w-5' />
                        <span className='text-sm font-bold'>Alemanha</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='fr' className='w-5' />
                        <span className='text-sm font-bold'>França</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <Flag code='mx' className='w-5' />
                        <span className='text-sm font-bold'>Mexico</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                  </div>
                )}

                {activeLocation === 'estados' && (
                  <div className='flex w-full flex-col pl-3'>
                    <div className='mt-3 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>São Paulo</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        6000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>
                          Rio de Janeiro
                        </span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Paraná</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>
                          Santa Catarina
                        </span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>
                          Mato Grosso do Sul
                        </span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Minas Gerais</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Bahia</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                  </div>
                )}

                {activeLocation === 'cidades' && (
                  <div className='flex w-full flex-col pl-3'>
                    <div className='mt-3 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Londrina</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        6000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Maringá</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Pinhais</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        4000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>
                          São Jose dos Pinhais
                        </span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Curitiba</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>

                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Pato Branco</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                    <div className='mt-1 flex w-full justify-between pl-5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>Foz do Iguaçu</span>
                      </div>

                      <span className='text-kirofy-primary ml-3 text-sm'>
                        2000
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : isPending ? (
        <div className='h-[430px] sm:w-auto lg:w-full'>
          <Card className='h-[430px] sm:w-auto lg:w-full'>
            <CardContent className='flex h-[430px] flex-col items-center justify-center'>
              <div
                className='border-gray-200 h-10 w-10 animate-spin rounded-full border-4 border-t-4'
                style={{ borderTopColor: '#19dbfe' }}
              />
            </CardContent>
          </Card>
        </div>
      ) : isDataEmpty ? (
        <Card className='h-[430px] sm:w-auto lg:w-full'>
          <CardHeader className='w-full flex-row items-center justify-between space-y-0'>
            <div className='flex w-[500px] items-center gap-3 lg:justify-between'>
              <h2 className='font-bold'>Localização</h2>
            </div>
            <div className='flex w-40 items-center justify-between'>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeLocation === 'paises' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveLocation('paises')}
              >
                Paises
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeLocation === 'estados' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveLocation('estados')}
              >
                Estados
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeLocation === 'cidades' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveLocation('cidades')}
              >
                Cidades
              </Button>
            </div>
          </CardHeader>
          <CardContent className='flex'>
            <div className='relative bottom-7 border-r border-kirofy-default/50 sm:w-[420px] md:w-[500px]'>
              <MapChartEmpity />
            </div>

            <div className='flex w-full flex-col'>
              <header className='flex w-full justify-between pl-4'>
                <span className='pl-3 text-sm text-muted-foreground'>
                  {activeLocation === 'paises' && 'Nome do País'}
                  {activeLocation === 'estados' && 'Nome do Estado'}
                  {activeLocation === 'cidades' && 'Nome da Cidade'}
                </span>
                <span className='text-sm text-muted-foreground'>
                  Visitantes
                </span>
              </header>

              {/* Renderização condicional dos dados com base na localização ativa */}
              {activeLocation === 'paises' && (
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
              )}

              {activeLocation === 'estados' && (
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
              )}

              {activeLocation === 'cidades' && (
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
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className='h-[430px] sm:w-auto lg:w-full'>
          <CardHeader className='w-full flex-row items-center justify-between space-y-0'>
            <div className='flex w-[500px] items-center gap-3 lg:justify-between'>
              <h2 className='font-bold'>Localização</h2>
            </div>
            <div className='flex w-40 items-center justify-between'>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeLocation === 'paises' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveLocation('paises')}
              >
                Paises
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeLocation === 'estados' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveLocation('estados')}
              >
                Estados
              </Button>
              <Button
                variant='link'
                className={`mt-0 p-0 text-xs ${activeLocation === 'cidades' ? '' : 'text-muted-foreground'}`}
                onClick={() => setActiveLocation('cidades')}
              >
                Cidades
              </Button>
            </div>
          </CardHeader>
          <CardContent className='flex'>
            <div className='relative bottom-7 border-r border-kirofy-default/50 sm:w-[420px] md:w-[500px]'>
              {
                // @ts-ignore
                <MapChart results={data?.results} />
              }
            </div>

            <div className='flex w-full flex-col'>
              <header className='flex w-full justify-between pl-4'>
                <span className='pl-3 text-sm text-muted-foreground'>
                  {activeLocation === 'paises' && 'Nome do País'}
                  {activeLocation === 'estados' && 'Nome do Estado'}
                  {activeLocation === 'cidades' && 'Nome da Cidade'}
                </span>
                <span className='text-sm text-muted-foreground'>
                  Visitantes
                </span>
              </header>

              {activeLocation === 'paises' && (
                <div className='mt-3 flex w-full flex-col pl-3'>
                  {// @ts-ignore
                  data?.results?.map((data, i: number) => {
                    return (
                      <Fragment key={Number(i)}>
                        <div className='mt-1 flex w-full justify-between pl-5'>
                          <div className='flex items-center gap-2'>
                            <Flag code={data.code} className='w-5' />
                            <span className='text-sm font-bold'>
                              {data.name}
                            </span>
                          </div>

                          <span className='text-kirofy-primary ml-3 text-sm'>
                            {data.visitors}
                          </span>
                        </div>
                      </Fragment>
                    )
                  })}
                </div>
              )}

              {activeLocation === 'estados' && (
                <div className='mt-2 flex w-full flex-col pl-3'>
                  {statesData
                    ? // @ts-ignore
                      statesData?.results?.map((data, i: number) => {
                        return (
                          <Fragment key={Number(i)}>
                            <div className='mt-1 flex w-full justify-between pl-5'>
                              <div className='flex items-center gap-2'>
                                <span className='text-sm font-bold'>
                                  {data.name}
                                </span>
                              </div>

                              <span className='text-kirofy-primary ml-3 text-sm'>
                                {data.visitors}
                              </span>
                            </div>
                          </Fragment>
                        )
                      })
                    : isStatesPending && (
                        <div className='flex h-64 w-full items-center justify-center'>
                          <div
                            className='border-gray-200 h-10 w-10 animate-spin rounded-full border-4 border-t-4'
                            style={{ borderTopColor: '#19dbfe' }}
                          />
                        </div>
                      )}
                </div>
              )}

              {activeLocation === 'cidades' && (
                <div className='mt-2 flex w-full flex-col pl-3'>
                  {citiesData
                    ? // @ts-ignore
                      citiesData?.results?.map((data, i: number) => {
                        return (
                          <Fragment key={Number(i)}>
                            <div className='mt-1 flex w-full justify-between pl-5'>
                              <div className='flex items-center gap-2'>
                                <span className='text-sm font-bold'>
                                  {data.name}
                                </span>
                              </div>

                              <span className='text-kirofy-primary ml-3 text-sm'>
                                {data.visitors}
                              </span>
                            </div>
                          </Fragment>
                        )
                      })
                    : isCitiesPending && (
                        <div className='flex h-64 w-full items-center justify-center'>
                          <div
                            className='border-gray-200 h-10 w-10 animate-spin rounded-full border-4 border-t-4'
                            style={{ borderTopColor: '#19dbfe' }}
                          />
                        </div>
                      )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
