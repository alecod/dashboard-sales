'use client'
import { getUtmsAnalyticsFetch } from '@/actions/analytics/get-utms'
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

export function UtmsCard() {
  const { period, date } = usePlausibleHook()
  const { selectedStore } = useStoreHook()

  const [selectedUtm, setSelectedUtm] = useState('term')
  const { shopifyIntegration } = useShopifyIntegrationHook()
  const { ecommerceIntegration } = useEcommerceIntegrationHook()
  const queryClient = useQueryClient()

  const utmTitles: Record<string, string> = {
    term: 'UTM Term',
    source: 'UTM Source',
    medium: 'UTM Medium',
    campaign: 'UTM Campaign',
    content: 'UTM Content',
  }

  const getHasPlatformIntegration = (): boolean => {
    switch (ecommerceIntegration?.type) {
      case 'shopify':
        return !!shopifyIntegration
    }
    return false
  }

  const fetchUtmData = (endpoint: string) => {
    return async () => {
      const response = await getUtmsAnalyticsFetch({
        date: date,
        domain: shopifyIntegration?.domain,
        period: period,
        endpoint,
      })
      if (!response?.data) {
        throw new Error('Erro ao buscar dados da API Plausible')
      }
      return await response.data
    }
  }

  const {
    data: termData,
    isPending: termIsPending,
    isError,
  } = useQuery({
    queryKey: ['plausible-utm-term', selectedStore?.store_cod, period, date],
    queryFn: fetchUtmData('utm_terms'),
    enabled:
      selectedUtm === 'term' &&
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
        ['plausible-utm-term', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isError])

  const {
    data: sourceData,
    isPending: sourceIsPending,
    isError: isErrorSource,
  } = useQuery({
    queryKey: ['plausible-utm-source', selectedStore?.store_cod, period, date],
    queryFn: fetchUtmData('utm_sources'),
    enabled:
      selectedUtm === 'source' &&
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
    if (!isErrorSource) {
      queryClient.setQueryDefaults(
        ['plausible-utm-source', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isErrorSource])

  const {
    data: mediumData,
    isPending: mediumIsPending,
    isError: isErrorMedium,
  } = useQuery({
    queryKey: ['plausible-utm-medium', selectedStore?.store_cod, period, date],
    queryFn: fetchUtmData('utm_mediums'),
    enabled:
      selectedUtm === 'medium' &&
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
    if (!isErrorMedium) {
      queryClient.setQueryDefaults(
        ['plausible-utm-medium', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isErrorMedium])

  const {
    data: campaignData,
    isPending: campaignIsPending,
    isError: isErrorCampain,
  } = useQuery({
    queryKey: [
      'plausible-utm-campaigns',
      selectedStore?.store_cod,
      period,
      date,
    ],
    queryFn: fetchUtmData('utm_campaigns'),
    enabled:
      selectedUtm === 'campaign' &&
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
    if (!isErrorCampain) {
      queryClient.setQueryDefaults(
        ['plausible-utm-campaigns', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isErrorCampain])

  const {
    data: contentData,
    isPending: contentIsPending,
    isError: isErrorContent,
  } = useQuery({
    queryKey: ['plausible-utm-content', selectedStore?.store_cod, period, date],
    queryFn: fetchUtmData('utm_contents'),
    enabled:
      selectedUtm === 'content' &&
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
    if (!isErrorContent) {
      queryClient.setQueryDefaults(
        ['plausible-utm-content', selectedStore?.store_cod, period, date],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isErrorContent])

  const selectedData =
    selectedUtm === 'term'
      ? termData
      : selectedUtm === 'source'
        ? sourceData
        : selectedUtm === 'medium'
          ? mediumData
          : selectedUtm === 'campaign'
            ? campaignData
            : contentData

  const isPending =
    selectedUtm === 'term'
      ? termIsPending
      : selectedUtm === 'source'
        ? sourceIsPending
        : selectedUtm === 'medium'
          ? mediumIsPending
          : selectedUtm === 'campaign'
            ? campaignIsPending
            : contentIsPending

  const isDataEmpty = selectedData?.results?.length === 0

  const truncateText = (text: string, length: number) => {
    if (text.length > length) {
      return `${text.substring(0, length)}...`
    }
    return text
  }

  const formatDuration = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 3600))
    const hours = Math.floor((seconds % (24 * 3600)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    let formattedTime = ''
    if (days > 0) formattedTime += `${days}d `
    if (hours > 0) formattedTime += `${hours}h `
    if (minutes > 0) formattedTime += `${minutes}m `
    if (secs > 0) formattedTime += `${secs}s`

    return formattedTime.trim()
  }

  return (
    <>
      {!ecommerceIntegration ? (
        <div className='h-[430px] w-[650px]'>
          <div className='absolute z-50 flex h-[430px] w-[650px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] w-[650px] select-none blur-sm'>
            <CardHeader className='w-full flex-row items-center justify-between space-y-0'>
              <h2 className='font-bold'>{utmTitles[selectedUtm]}</h2>
              <div className='w-32'>
                <Select onValueChange={setSelectedUtm}>
                  <SelectTrigger>
                    <SelectValue placeholder={utmTitles[selectedUtm]} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='medium'>UTM Medium</SelectItem>
                      <SelectItem value='source'>UTM Source</SelectItem>
                      <SelectItem value='campaign'>UTM Campaign</SelectItem>
                      <SelectItem value='content'>UTM Content</SelectItem>
                      <SelectItem value='term'>UTM Term</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className='flex h-96 w-full flex-col justify-between gap-3 overflow-y-auto lg:flex-row'>
              <Table className='mb-10'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Origem</TableHead>
                    <TableHead className='text-center'>Usuários</TableHead>
                    <TableHead className='text-center'>
                      Taxa de Rejeição
                    </TableHead>
                    <TableHead className='text-center'>
                      Tempo de Duração Média
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Banner Image</TableCell>
                    <TableCell className='text-center'>450</TableCell>
                    <TableCell className='text-center'>20%</TableCell>
                    <TableCell className='text-center'>1m 5s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Banner Image</TableCell>
                    <TableCell className='text-center'>450</TableCell>
                    <TableCell className='text-center'>20%</TableCell>
                    <TableCell className='text-center'>1m 5s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Banner Image</TableCell>
                    <TableCell className='text-center'>450</TableCell>
                    <TableCell className='text-center'>20%</TableCell>
                    <TableCell className='text-center'>1m 5s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Banner Image</TableCell>
                    <TableCell className='text-center'>450</TableCell>
                    <TableCell className='text-center'>20%</TableCell>
                    <TableCell className='text-center'>1m 5s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Banner Image</TableCell>
                    <TableCell className='text-center'>450</TableCell>
                    <TableCell className='text-center'>20%</TableCell>
                    <TableCell className='text-center'>1m 5s</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : isError ? (
        <div className='h-[430px] w-[650px]'>
          <div className='absolute z-50 flex h-[430px] w-[650px] flex-col items-center justify-center'>
            <LockClosedIcon className='text-gray-400 h-8 w-8' />
          </div>
          <Card className='h-[430px] w-[650px] select-none blur-sm'>
            <CardHeader className='w-full flex-row items-center justify-between space-y-0'>
              <h2 className='font-bold'>{utmTitles[selectedUtm]}</h2>
              <div className='w-32'>
                <Select onValueChange={setSelectedUtm}>
                  <SelectTrigger>
                    <SelectValue placeholder={utmTitles[selectedUtm]} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='medium'>UTM Medium</SelectItem>
                      <SelectItem value='source'>UTM Source</SelectItem>
                      <SelectItem value='campaign'>UTM Campaign</SelectItem>
                      <SelectItem value='content'>UTM Content</SelectItem>
                      <SelectItem value='term'>UTM Term</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className='flex h-96 w-full flex-col justify-between gap-3 overflow-y-auto lg:flex-row'>
              <Table className='mb-10'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Origem</TableHead>
                    <TableHead className='text-center'>Usuários</TableHead>
                    <TableHead className='text-center'>
                      Taxa de Rejeição
                    </TableHead>
                    <TableHead className='text-center'>
                      Tempo de Duração Média
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Banner Image</TableCell>
                    <TableCell className='text-center'>450</TableCell>
                    <TableCell className='text-center'>20%</TableCell>
                    <TableCell className='text-center'>1m 5s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Banner Image</TableCell>
                    <TableCell className='text-center'>450</TableCell>
                    <TableCell className='text-center'>20%</TableCell>
                    <TableCell className='text-center'>1m 5s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Banner Image</TableCell>
                    <TableCell className='text-center'>450</TableCell>
                    <TableCell className='text-center'>20%</TableCell>
                    <TableCell className='text-center'>1m 5s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Banner Image</TableCell>
                    <TableCell className='text-center'>450</TableCell>
                    <TableCell className='text-center'>20%</TableCell>
                    <TableCell className='text-center'>1m 5s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Banner Image</TableCell>
                    <TableCell className='text-center'>450</TableCell>
                    <TableCell className='text-center'>20%</TableCell>
                    <TableCell className='text-center'>1m 5s</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : isPending ? (
        <Card className='h-[430px] w-[650px]'>
          <div className='flex h-[430px] w-[650px] items-center justify-center'>
            <div
              className='border-gray-200 h-10 w-10 animate-spin rounded-full border-4 border-t-4'
              style={{ borderTopColor: '#19dbfe' }}
            />
          </div>
        </Card>
      ) : (
        <Card className='h-[430px] w-[650px]'>
          <CardHeader className='w-full flex-row items-center justify-between space-y-0'>
            <h2 className='font-bold'>{utmTitles[selectedUtm]}</h2>
            <div className='w-32'>
              <Select onValueChange={setSelectedUtm}>
                <SelectTrigger>
                  <SelectValue placeholder={utmTitles[selectedUtm]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='medium'>UTM Medium</SelectItem>
                    <SelectItem value='source'>UTM Source</SelectItem>
                    <SelectItem value='campaign'>UTM Campaign</SelectItem>
                    <SelectItem value='content'>UTM Content</SelectItem>
                    <SelectItem value='term'>UTM Term</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className='flex h-96 w-[650px] flex-col justify-between gap-3 overflow-y-auto lg:flex-row'>
            {/* Render the selected data in table format */}
            <Table className='mb-10'>
              <TableHeader>
                <TableRow>
                  <TableHead>Origem</TableHead>
                  <TableHead className='text-center'>Usuários</TableHead>
                  <TableHead className='text-center'>
                    Taxa de Rejeição
                  </TableHead>
                  <TableHead className='text-center'>
                    Tempo de Duração Média
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isDataEmpty ? (
                  <TableRow>
                    <TableCell colSpan={4}>
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
                        {data.visitors ?? '0'}
                      </TableCell>
                      <TableCell className='text-center'>
                        {data.bounce_rate ?? '0'}%
                      </TableCell>
                      <TableCell className='text-center'>
                        {formatDuration(data.visit_duration) || '0s'}
                      </TableCell>
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
