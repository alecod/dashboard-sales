'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardHook } from '@/hooks/dashboard-hook'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { ShoppingCart, TrendingUpIcon } from 'lucide-react'
import { GrCircleAlert } from 'react-icons/gr'
import { Bar, BarChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardFooter, CardHeader } from '../../ui/card'

export function TotalProfitCard({
  isError,
  isLoading,
}: {
  isError: boolean
  isLoading: boolean
}) {
  const {
    totalPorfit,
    dashboardTaxes,
    totalPaidOrders,
    isLoadingShopifyDashboardData,
  } = useDashboardHook()

  const { ecommerceIntegration } = useEcommerceIntegrationHook()

  const stat = {
    chart: [
      { name: 'Janeiro', sale: 30 },
      { name: 'Feb', sale: 45 },
      { name: 'Mar', sale: 70 },
      { name: 'Apr', sale: 50 },
      { name: 'May', sale: 100 },
      { name: 'Jun', sale: 85 },
      { name: 'Jul', sale: 65 },
    ],
    fill: '#28a745',
  }

  return (
    <>
      {!ecommerceIntegration || isLoading ? (
        <div className='flex h-auto w-full flex-col md:w-full lg:h-[33rem] lg:min-w-80'>
          <Card className='flex h-auto w-full select-none flex-col border blur-sm md:w-full lg:h-[33rem] lg:min-w-80'>
            <CardHeader className='flex h-28 w-[20rem] flex-col justify-between md:w-full'>
              <div className='mt-5 flex flex-col items-center justify-between gap-3 lg:flex-col'>
                <div className='mb-1 flex w-full flex-row items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <ShoppingCart className='h-6 w-6' />
                  </div>

                  <div className='flex w-full cursor-pointer items-center justify-end gap-2 text-xs text-muted-foreground underline'>
                    <span>Mais Informações</span>
                    <GrCircleAlert size={15} />
                  </div>
                </div>

                <hr className='h-[0.125rem] w-full bg-[#28a745]' />
              </div>
            </CardHeader>
            <CardContent className='flex w-full flex-row flex-wrap items-center justify-between'>
              <div className='flex flex-col'>
                <p>Lucro Líquido (R$)</p>
                <div className='flex items-center gap-2 text-2xl'>
                  <span className='text-[20px] font-bold text-[#28a745]'>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(0)}
                  </span>
                  <TrendingUpIcon fill='#ffeb3b' color='#ffeb3b' />
                </div>
              </div>
              <ResponsiveContainer
                width='30%'
                height={60}
                className='md:hidden md:w-[40%] xl:block'
              >
                <BarChart barSize={10} data={stat.chart}>
                  <Bar dataKey='sale' fill={stat.fill} radius={1} />
                </BarChart>
              </ResponsiveContainer>
              <hr className='mt-6 h-[0.125rem] w-full bg-[#28a745]' />
            </CardContent>
            <CardFooter className='flex flex-col'>
              <div className='flex w-full justify-start'>
                <span>Descontos:</span>
              </div>
              <div className='mt-3 flex w-full justify-between'>
                <span>Pedidos Pagos:</span>
                <span className='font-bold'>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(0)}
                </span>
              </div>
              <div className='flex w-full justify-between'>
                <span>Impostos:</span>
                <span className='font-bold'>
                  -{''}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(Number(0))}
                </span>
              </div>
              <div className='flex w-full justify-between'>
                <span>Taxas de Gateway:</span>
                <span className='font-bold'>
                  -{''}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(Number(0))}
                </span>
              </div>
              <div className='flex w-full justify-between'>
                <span>Taxas de Checkout:</span>
                <span className='font-bold'>
                  -{''}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(Number(0))}
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : isError ? (
        <Card className='flex h-auto w-full flex-col border md:w-full lg:h-[33rem] lg:min-w-80'>
          <CardHeader className='flex h-28 w-full flex-col justify-between md:w-full'>
            <div className='mt-5 flex flex-col items-center justify-between gap-3 lg:flex-col'>
              <div className='mb-1 flex w-full flex-row items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <ShoppingCart className='h-6 w-6' />
                </div>

                <div className='flex w-full cursor-pointer items-center justify-end gap-2 text-xs text-muted-foreground underline'>
                  <span>Mais Informações</span>
                  <GrCircleAlert size={15} />
                </div>
              </div>

              <hr className='h-[0.125rem] w-full bg-[#28a745]' />
            </div>
          </CardHeader>
          <CardContent className='flex w-full flex-row flex-wrap items-center justify-between'>
            <div className='flex items-center justify-center gap-3'>
              <ExclamationTriangleIcon
                className='h-5 w-5'
                fill='#9fa3a6'
                color='#9fa3a6'
              />
              <span className='text-sm text-muted-foreground'>
                Sem dados no período selecionado
              </span>
            </div>
            <hr className='mt-6 h-[0.125rem] w-full bg-[#28a745]' />
          </CardContent>
          <CardFooter className='flex flex-col'>
            <div className='flex w-full justify-start'>
              <span>Descontos:</span>
            </div>
            <div className='mt-3 flex w-full justify-between'>
              <span>Pedidos Pagos:</span>
              <span className='font-bold'>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(0)}
              </span>
            </div>
            <div className='flex w-full justify-between'>
              <span>Impostos:</span>
              <span className='font-bold'>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(0))}
              </span>
            </div>
            <div className='flex w-full justify-between'>
              <span>Taxas de Gateway:</span>
              <span className='font-bold'>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(0))}
              </span>
            </div>
            <div className='flex w-full justify-between'>
              <span>Taxas de Checkout:</span>
              <span className='font-bold'>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(0))}
              </span>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className='flex h-auto w-full flex-col md:w-full lg:h-[33rem] lg:min-w-80'>
          <CardHeader className='flex h-28 w-full flex-col justify-between md:w-full'>
            <div className='mt-5 flex flex-col items-center justify-between gap-3 lg:flex-col'>
              <div className='mb-1 flex w-full flex-row items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {isLoadingShopifyDashboardData ? (
                    <Skeleton className='h-6 w-6' />
                  ) : (
                    <ShoppingCart className='h-6 w-6' />
                  )}
                </div>
                {isLoadingShopifyDashboardData ? (
                  <>
                    <Skeleton className='h-4 w-48' />
                  </>
                ) : (
                  <div className='flex w-full cursor-pointer items-center justify-end gap-2 text-xs text-muted-foreground underline'>
                    <span>Mais Informações</span>
                    <GrCircleAlert size={15} />
                  </div>
                )}
              </div>

              {isLoadingShopifyDashboardData ? (
                <Skeleton className='h-[0.125rem] w-full' />
              ) : (
                <hr className='h-[0.125rem] w-full bg-[#28a745]' />
              )}
            </div>
          </CardHeader>
          <CardContent className='flex w-full flex-row flex-wrap items-center justify-between'>
            <div className='flex flex-col'>
              {isLoadingShopifyDashboardData ? (
                <Skeleton className='h-4 w-20' />
              ) : (
                <p>Lucro Líquido (R$)</p>
              )}

              <div className='flex items-center gap-2 text-2xl'>
                {isLoadingShopifyDashboardData ? (
                  <Skeleton className='mt-2 h-8 w-24' />
                ) : (
                  <>
                    <span className='text-[20px] font-bold text-[#28a745]'>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(totalPorfit)}
                    </span>
                    <TrendingUpIcon fill='#ffeb3b' color='#ffeb3b' />
                  </>
                )}
              </div>
            </div>

            {isLoadingShopifyDashboardData ? (
              <Skeleton className='h-14 w-24' />
            ) : (
              <ResponsiveContainer
                width='30%'
                height={60}
                className='md:hidden md:w-[40%] xl:block'
              >
                <BarChart barSize={10} data={stat.chart}>
                  <Bar dataKey='sale' fill={stat.fill} radius={1} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {isLoadingShopifyDashboardData ? (
              <Skeleton className='mt-6 h-[0.125rem] w-full' />
            ) : (
              <hr className='mt-6 h-[0.125rem] w-full bg-[#28a745]' />
            )}
          </CardContent>
          <CardFooter className='flex flex-col'>
            {isLoadingShopifyDashboardData ? (
              <>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-5 rounded-full' />
                    <Skeleton className='h-4 w-[5rem]' />
                  </div>
                  <Skeleton className='h-4 w-[5rem]' />
                </div>
                <div className='mt-1 flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-5 rounded-full' />
                    <Skeleton className='h-4 w-[5rem]' />
                  </div>
                  <Skeleton className='h-4 w-[5rem]' />
                </div>
                <div className='mt-1 flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-5 rounded-full' />
                    <Skeleton className='h-4 w-[5rem]' />
                  </div>
                  <Skeleton className='h-4 w-[5rem]' />
                </div>
                <div className='mt-1 flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-5 rounded-full' />
                    <Skeleton className='h-4 w-[5rem]' />
                  </div>
                  <Skeleton className='h-4 w-[5rem]' />
                </div>
              </>
            ) : (
              <>
                <div className='flex w-full justify-start'>
                  <span>Descontos:</span>
                </div>
                <div className='mt-3 flex w-full justify-between'>
                  <span>Pedidos Pagos:</span>
                  <span className='font-bold'>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(totalPaidOrders)}
                  </span>
                </div>
                <div className='flex w-full justify-between'>
                  <span>Impostos:</span>
                  <span className='font-bold'>
                    -{''}
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(Number(dashboardTaxes.invoicing))}
                  </span>
                </div>
                <div className='flex w-full justify-between'>
                  <span>Taxas de Gateway:</span>
                  <span className='font-bold'>
                    -{''}
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(Number(dashboardTaxes.gateway))}
                  </span>
                </div>
                <div className='flex w-full justify-between'>
                  <span>Taxas de Checkout:</span>
                  <span className='font-bold'>
                    -{''}
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(Number(dashboardTaxes.checkout))}
                  </span>
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  )
}
