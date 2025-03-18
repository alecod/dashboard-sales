'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardHook } from '@/hooks/dashboard-hook'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import { Card, CardContent } from '../../ui/card'

export function ProfitMarginCard({
  isError,
  isLoading,
}: {
  isError: boolean
  isLoading: boolean
}) {
  const { isLoadingShopifyDashboardData, totalRevenue, totalPorfit } =
    useDashboardHook()
  const { ecommerceIntegration } = useEcommerceIntegrationHook()

  // Cálculo da margem de lucro
  const profitMargin =
    totalRevenue && totalPorfit ? (totalPorfit / totalRevenue) * 100 : 0 // Retorna 0 se os dados não estiverem disponíveis

  // Função para formatar a margem de lucro com duas casas decimais
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <>
      {!ecommerceIntegration || isLoading ? (
        <Card className='flex w-60 select-none items-center justify-center blur-sm lg:w-full'>
          <CardContent className='flex h-40 items-center justify-center lg:h-20'>
            <span className='relative top-3 flex flex-col items-center text-center'>
              Margem de Lucro: <span className='font-bold'>N/A</span>
            </span>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className='flex w-60 items-center justify-center lg:w-full'>
          <CardContent className='flex h-40 items-center justify-center lg:h-20'>
            <span className='relative top-3 flex flex-col items-center text-center'>
              Margem de Lucro: <span className='font-bold'>N/A</span>
            </span>
          </CardContent>
        </Card>
      ) : (
        <>
          {isLoadingShopifyDashboardData ? (
            <Card className='flex h-20 w-60 items-center justify-center lg:w-full'>
              <Skeleton className='h-8 w-8' />
              <Skeleton className='h-8 w-24' />
            </Card>
          ) : (
            <Card className='flex w-60 items-center justify-center lg:w-full'>
              <CardContent className='flex h-40 items-center justify-center lg:h-20'>
                <span className='relative top-3 flex flex-col items-center text-center'>
                  Margem de Lucro:{' '}
                  <span className='font-bold'>
                    {totalRevenue && totalPorfit
                      ? formatPercentage(profitMargin)
                      : 'N/A'}
                  </span>
                </span>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  )
}
