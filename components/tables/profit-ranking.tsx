'use client'

import { getShopifyDashboardDataFetch } from '@/actions/shopify/get-shopify-dashboard-data'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ENV } from '@/env/env-store'
import { useFilterDashboardHook } from '@/hooks/dashboard-filter-hook'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

export type ItemRanking = {
  product_id: number
  variant_id: number
  product_title: string
  variant_title: string
  profit: string
  profit_percentage: string
}

export function ProfitRankingTable({
  isError,
  isLoading,
}: {
  isError: boolean
  isLoading: boolean
}) {
  const { dateRange, status } = useFilterDashboardHook()
  const { ecommerceIntegration } = useEcommerceIntegrationHook()
  const { API_URL } = ENV()
  const token = Cookies.get('k_a_t')
  const queryClient = useQueryClient()
  const { selectedStore } = useStoreHook()

  const {
    data: shopifyDashboardData,
    isError: isErrorQuery,
    isPending,
    error,
  } = useQuery({
    enabled: !!ecommerceIntegration && !!API_URL,
    initialData: null,
    queryKey: [
      'shopify-dashboard-data',
      ecommerceIntegration,
      dateRange,
      status,
    ],
    queryFn: async () =>
      await getShopifyDashboardDataFetch({
        store_cod: selectedStore?.store_cod as number,
        startDate: dateRange?.from?.toISOString() || '',
        endDate: dateRange?.to?.toISOString() || '',
        status,
      }).then((res) => res?.data),

    retry: 0,
    refetchOnWindowFocus: false,
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isErrorQuery) {
      queryClient.setQueryDefaults(
        ['shopify-dashboard-data', ecommerceIntegration, dateRange, status],
        { staleTime: Number.POSITIVE_INFINITY },
      )
    }
  }, [isErrorQuery])

  return (
    <div className='w-full'>
      <div className='mt-10'>
        <div className='container mx-auto mt-5 p-0'>
          <div className='scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 overflow-x-auto'>
            <div className='min-w-[1200px]'>
              <div className='flex flex-col'>
                {/* Cabeçalho da tabela fixo */}
                <div className='sticky top-0 z-10 flex justify-between border-b bg-k-white font-medium text-muted-foreground dark:bg-k-greenDark'>
                  <div className='flex w-64 items-center justify-center border-r p-4 text-sm'>
                    ID do Produto
                  </div>
                  <div className='flex w-64 items-center justify-center border-r p-4 text-sm'>
                    Nome do Produto
                  </div>
                  <div className='flex w-64 items-center justify-center border-r p-4 text-sm'>
                    Nome da Variante
                  </div>
                  <div className='flex w-64 items-center justify-center border-r p-4 text-sm'>
                    Lucro
                  </div>
                  <div className='flex w-64 items-center justify-center border-r p-4 text-sm'>
                    Percentual de Lucro
                  </div>
                </div>

                {/* Corpo da tabela */}
                <div className='flex flex-col'>
                  {isPending ? (
                    // Estado de carregamento
                    Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={Number(index)}
                        className='flex h-16 w-full items-center justify-between bg-[#f8f9faff] dark:bg-[#09171d]'
                      >
                        <div className='flex w-64 items-center justify-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-64 items-center justify-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-64 items-center justify-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-64 items-center justify-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-64 items-center justify-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                      </div>
                    ))
                  ) : shopifyDashboardData?.items_ranking?.length ? (
                    // Estado quando há dados
                    shopifyDashboardData.items_ranking.map(
                      (item: ItemRanking, index: number) => (
                        <div
                          key={Number(index)}
                          className='flex h-16 w-full items-center justify-between bg-[#f8f9faff] dark:bg-[#09171d]'
                        >
                          <div className='flex w-64 items-center justify-center'>
                            {item.product_id}
                          </div>
                          <div className='flex w-64 text-left'>
                            {item.product_title}
                          </div>
                          <div className='flex w-64 items-center justify-center text-center'>
                            {item.variant_title}
                          </div>
                          <div className='flex w-64 items-center justify-center'>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(Number.parseFloat(item.profit))}
                          </div>
                          <div className='flex w-64 items-center justify-center'>
                            {(
                              Number.parseFloat(item.profit_percentage) * 100
                            ).toFixed(2)}
                            %
                          </div>
                        </div>
                      ),
                    )
                  ) : isError || isLoading ? (
                    <div className='flex flex-col items-center justify-center gap-3 p-10 dark:bg-[#09171d]'>
                      <ExclamationTriangleIcon
                        className='h-8 w-8'
                        fill='#9fa3a6'
                        color='#9fa3a6'
                      />
                      <span className='text-sm text-muted-foreground'>
                        Sem dados no período selecionado
                      </span>
                    </div>
                  ) : (
                    <div className='flex flex-col items-center justify-center p-10 dark:bg-[#09171d]'>
                      <LockClosedIcon
                        className='text-gray-400 mr-2 h-8 w-8'
                        color='#94A3B8'
                      />
                      <p className='mt-3 text-lg text-muted-foreground'>
                        Para visualizar a tabela integre com a Shopify
                      </p>
                      <Button className='mt-5'>Integrações</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
