'use client'
import { getTopPagesAnalyticsFetch } from '@/actions/analytics/get-top-pages'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import usePlausibleHook from '@/hooks/plausible-hook'
import { useShopifyIntegrationHook } from '@/hooks/shopify-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function TopPagesCard() {
  const { period, date } = usePlausibleHook()
  const { selectedStore } = useStoreHook()

  const [selectedPage, setSelectedPage] = useState('top')
  const { shopifyIntegration } = useShopifyIntegrationHook()
  const { ecommerceIntegration } = useEcommerceIntegrationHook()
  const queryClient = useQueryClient()

  const pageTitles: Record<string, string> = {
    top: 'Páginas Mais Acessadas',
    entry: 'Páginas de Entrada',
    exit: 'Páginas de Saída',
  }

  const getHasPlatformIntegration = (): boolean => {
    switch (ecommerceIntegration?.type) {
      case 'shopify':
        return !!shopifyIntegration
    }
    return false
  }

  const fetchPageData = (endpoint: string) => {
    return async () => {
      const res = await getTopPagesAnalyticsFetch({
        date: date,
        domain: shopifyIntegration?.domain,
        period: period,
        endpoint: endpoint,
      })
      return res?.data
    }
  }

  const {
    data: topPagesData,
    isPending: topPagesIsPending,
    isError,
  } = useQuery({
    queryKey: ['plausible-top-pages', selectedStore?.store_cod, period, date],
    queryFn: fetchPageData('pages'),
    enabled:
      selectedPage === 'top' &&
      !!selectedStore?.store_cod &&
      !!period &&
      !!date &&
      getHasPlatformIntegration(),

    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    retry: 0,
    refetchOnWindowFocus: false,
  })

  const {
    data: entryPagesData,
    isPending: entryPagesIsPending,
    isError: isErrorEntry,
  } = useQuery({
    queryKey: ['plausible-entry-pages', selectedStore?.store_cod, period, date],
    queryFn: fetchPageData('entry-pages'),
    enabled:
      selectedPage === 'entry' &&
      !!selectedStore?.store_cod &&
      !!period &&
      !!date &&
      getHasPlatformIntegration(),
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    retry: 0,
    refetchOnWindowFocus: false,
  })

  const {
    data: exitPagesData,
    isPending: exitPagesIsPending,
    isError: isErrorExit,
  } = useQuery({
    queryKey: ['plausible-exit-pages', selectedStore?.store_cod, period, date],
    queryFn: fetchPageData('exit-pages'),
    enabled:
      selectedPage === 'exit' &&
      !!selectedStore?.store_cod &&
      !!period &&
      !!date &&
      getHasPlatformIntegration(),
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    retry: 0,
    refetchOnWindowFocus: false,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isError) {
      queryClient.setQueryDefaults(
        ['plausible-top-pages', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isError])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isErrorEntry) {
      queryClient.setQueryDefaults(
        ['plausible-entry-pages', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isErrorEntry])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isErrorExit) {
      queryClient.setQueryDefaults(
        ['plausible-exit-pages', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isErrorExit])

  const selectedData =
    selectedPage === 'top'
      ? topPagesData
      : selectedPage === 'entry'
        ? entryPagesData
        : exitPagesData

  const isPending =
    selectedPage === 'top'
      ? topPagesIsPending
      : selectedPage === 'entry'
        ? entryPagesIsPending
        : exitPagesIsPending

  const isDataEmpty = selectedData?.results?.length === 0

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '0s'
    const totalSeconds = Math.floor(seconds)
    const minutes = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${minutes}m ${secs}s`
  }

  const truncateText = (text: string, length: number) => {
    return text.length > length ? `${text.slice(0, length)}...` : text
  }

  return (
    <>
      {!ecommerceIntegration ? (
        <div className='h-[430px] w-full'>
          <div className='absolute z-50 flex h-[430px] w-[650px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] w-full select-none blur-sm'>
            <CardHeader className='w-full flex-row items-center justify-between space-y-0'>
              <h2 className='font-bold'>Paginas mais acessadas</h2>
              <div className='w-32'>
                <Select onValueChange={setSelectedPage}>
                  <SelectTrigger>
                    <SelectValue placeholder={'Selecione'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='top'>
                        Páginas Mais Acessadas
                      </SelectItem>
                      <SelectItem value='entry'>Páginas de Entrada</SelectItem>
                      <SelectItem value='exit'>Páginas de Saída</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className='flex h-96 w-full flex-col justify-between gap-3 overflow-y-auto lg:flex-row'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    {selectedPage === 'top' ? (
                      <>
                        <TableHead className='text-center'>
                          Visitantes
                        </TableHead>
                        <TableHead className='text-center'>Pageviews</TableHead>
                        <TableHead className='text-center'>
                          Taxa de Rejeição
                        </TableHead>
                        <TableHead className='text-center'>
                          Tempo de Duração Média
                        </TableHead>
                      </>
                    ) : selectedPage === 'entry' ? (
                      <>
                        <TableHead className='text-center'>
                          Visitantes
                        </TableHead>
                        <TableHead className='text-center'>Visitas</TableHead>
                        <TableHead className='text-center'>
                          Tempo de Duração Média
                        </TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className='text-center'>
                          Visitantes
                        </TableHead>
                        <TableHead className='text-center'>Visitas</TableHead>
                        <TableHead className='text-center'>
                          Taxa de Saída
                        </TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isDataEmpty ? (
                    <TableRow>
                      <TableCell colSpan={5}>
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
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell>/dashboard</TableCell>
                        <TableCell className='text-center'>1423</TableCell>
                        <TableCell className='text-center'>1235</TableCell>
                        <TableCell className='text-center'>10%</TableCell>
                        <TableCell className='text-center'>3m 40s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>/dashboard</TableCell>
                        <TableCell className='text-center'>1423</TableCell>
                        <TableCell className='text-center'>1235</TableCell>
                        <TableCell className='text-center'>10%</TableCell>
                        <TableCell className='text-center'>3m 40s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>/dashboard</TableCell>
                        <TableCell className='text-center'>1423</TableCell>
                        <TableCell className='text-center'>1235</TableCell>
                        <TableCell className='text-center'>10%</TableCell>
                        <TableCell className='text-center'>3m 40s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>/dashboard</TableCell>
                        <TableCell className='text-center'>1423</TableCell>
                        <TableCell className='text-center'>1235</TableCell>
                        <TableCell className='text-center'>10%</TableCell>
                        <TableCell className='text-center'>3m 40s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>/dashboard</TableCell>
                        <TableCell className='text-center'>1423</TableCell>
                        <TableCell className='text-center'>1235</TableCell>
                        <TableCell className='text-center'>10%</TableCell>
                        <TableCell className='text-center'>3m 40s</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : isError ? (
        <div className='h-[430px] w-full'>
          <div className='absolute z-50 flex h-[430px] w-[900px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] w-full select-none blur-sm'>
            <CardHeader className='w-full flex-row items-center justify-between space-y-0'>
              <h2 className='font-bold'>Paginas mais acessadas</h2>
              <div className='w-32'>
                <Select onValueChange={setSelectedPage}>
                  <SelectTrigger>
                    <SelectValue placeholder={'Selecione'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='top'>
                        Páginas Mais Acessadas
                      </SelectItem>
                      <SelectItem value='entry'>Páginas de Entrada</SelectItem>
                      <SelectItem value='exit'>Páginas de Saída</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className='flex h-96 w-full flex-col justify-between gap-3 overflow-y-auto lg:flex-row'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    {selectedPage === 'top' ? (
                      <>
                        <TableHead className='text-center'>
                          Visitantes
                        </TableHead>
                        <TableHead className='text-center'>Pageviews</TableHead>
                        <TableHead className='text-center'>
                          Taxa de Rejeição
                        </TableHead>
                        <TableHead className='text-center'>
                          Tempo de Duração Média
                        </TableHead>
                      </>
                    ) : selectedPage === 'entry' ? (
                      <>
                        <TableHead className='text-center'>
                          Visitantes
                        </TableHead>
                        <TableHead className='text-center'>Visitas</TableHead>
                        <TableHead className='text-center'>
                          Tempo de Duração Média
                        </TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className='text-center'>
                          Visitantes
                        </TableHead>
                        <TableHead className='text-center'>Visitas</TableHead>
                        <TableHead className='text-center'>
                          Taxa de Saída
                        </TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isDataEmpty ? (
                    <TableRow>
                      <TableCell colSpan={5}>
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
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell>/dashboard</TableCell>
                        <TableCell className='text-center'>1423</TableCell>
                        <TableCell className='text-center'>1235</TableCell>
                        <TableCell className='text-center'>10%</TableCell>
                        <TableCell className='text-center'>3m 40s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>/dashboard</TableCell>
                        <TableCell className='text-center'>1423</TableCell>
                        <TableCell className='text-center'>1235</TableCell>
                        <TableCell className='text-center'>10%</TableCell>
                        <TableCell className='text-center'>3m 40s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>/dashboard</TableCell>
                        <TableCell className='text-center'>1423</TableCell>
                        <TableCell className='text-center'>1235</TableCell>
                        <TableCell className='text-center'>10%</TableCell>
                        <TableCell className='text-center'>3m 40s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>/dashboard</TableCell>
                        <TableCell className='text-center'>1423</TableCell>
                        <TableCell className='text-center'>1235</TableCell>
                        <TableCell className='text-center'>10%</TableCell>
                        <TableCell className='text-center'>3m 40s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>/dashboard</TableCell>
                        <TableCell className='text-center'>1423</TableCell>
                        <TableCell className='text-center'>1235</TableCell>
                        <TableCell className='text-center'>10%</TableCell>
                        <TableCell className='text-center'>3m 40s</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : isPending ? (
        <Card className='h-[430px] w-full'>
          <div className='flex h-[430px] w-full items-center justify-center'>
            <div
              className='border-gray-200 h-10 w-10 animate-spin rounded-full border-4 border-t-4'
              style={{ borderTopColor: '#19dbfe' }}
            />
          </div>
        </Card>
      ) : (
        <Card className='h-[430px] w-full'>
          <CardHeader className='w-full flex-row items-center justify-between space-y-0'>
            <h2 className='font-bold'>{pageTitles[selectedPage]}</h2>
            <div className='w-32'>
              <Select onValueChange={setSelectedPage}>
                <SelectTrigger>
                  <SelectValue placeholder={pageTitles[selectedPage]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='top'>Páginas Mais Acessadas</SelectItem>
                    <SelectItem value='entry'>Páginas de Entrada</SelectItem>
                    <SelectItem value='exit'>Páginas de Saída</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className='flex h-96 w-full flex-col justify-between gap-3 overflow-y-auto lg:flex-row'>
            <Table className='mb-10'>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  {selectedPage === 'top' ? (
                    <>
                      <TableHead className='text-center'>Visitantes</TableHead>
                      <TableHead className='text-center'>Pageviews</TableHead>
                      <TableHead className='text-center'>
                        Taxa de Rejeição
                      </TableHead>
                      <TableHead className='text-center'>
                        Tempo de Duração Média
                      </TableHead>
                    </>
                  ) : selectedPage === 'entry' ? (
                    <>
                      <TableHead className='text-center'>Visitantes</TableHead>
                      <TableHead className='text-center'>Visitas</TableHead>
                      <TableHead className='text-center'>
                        Tempo de Duração Média
                      </TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className='text-center'>Visitantes</TableHead>
                      <TableHead className='text-center'>Visitas</TableHead>
                      <TableHead className='text-center'>
                        Taxa de Saída
                      </TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isDataEmpty ? (
                  <TableRow>
                    <TableCell colSpan={5}>
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
                    </TableCell>
                  </TableRow>
                ) : (
                  // @ts-ignore
                  selectedData?.results?.map((data, i: number) => (
                    <TableRow key={Number(i)}>
                      <TableCell>{truncateText(data.name, 30)}</TableCell>
                      <TableCell className='text-center'>
                        {data.visitors ?? 0}
                      </TableCell>
                      {selectedPage === 'top' ? (
                        <>
                          <TableCell className='text-center'>
                            {data.pageviews ?? 0}
                          </TableCell>
                          <TableCell className='text-center'>
                            {data.bounce_rate !== null
                              ? `${data.bounce_rate}%`
                              : '0%'}
                          </TableCell>
                          <TableCell className='text-center'>
                            {formatDuration(data.time_on_page)}
                          </TableCell>
                        </>
                      ) : selectedPage === 'entry' ? (
                        <>
                          <TableCell className='text-center'>
                            {data.visits ?? 0}
                          </TableCell>
                          <TableCell className='text-center'>
                            {formatDuration(data.visit_duration)}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className='text-center'>
                            {data.visits ?? 0}
                          </TableCell>
                          <TableCell className='text-center'>
                            {data.exit_rate ? `${data.exit_rate}%` : '0%'}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  )
}
