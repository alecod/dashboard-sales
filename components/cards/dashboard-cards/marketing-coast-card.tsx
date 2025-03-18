'use client'
import { SheetDashboard } from '@/components/sheet/dashboard-sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { SwitchCards } from '@/components/ui/switch-cards'
import { useDashboardHook } from '@/hooks/dashboard-hook'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { Megaphone, TrendingUpIcon } from 'lucide-react'
import { useState } from 'react'
import { GrCircleAlert } from 'react-icons/gr'
import { Bar, BarChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardFooter, CardHeader } from '../../ui/card'

export function MarketingCoastCard({
  isError,
  isLoading,
}: {
  isError: boolean
  isLoading: boolean
}) {
  const [showSheet, setShowSheet] = useState(false)
  const { ecommerceIntegration } = useEcommerceIntegrationHook()

  const {
    toggleIncludeFacebookCampaignCosts,
    includeFacebookCampaignCosts,
    totalAdCosts,
    totalFacebookCampaignCost,
    isLoadingShopifyDashboardData,
  } = useDashboardHook()

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
    fill: '#70c08b',
  }

  return (
    <>
      {!ecommerceIntegration || isLoading ? (
        <div className='flex h-96 w-80 flex-col items-center justify-center md:h-auto md:w-[360px] lg:w-full lg:min-w-80'>
          <Card className='flex h-96 w-80 select-none flex-col blur-sm md:h-auto md:w-[360px] lg:w-full lg:min-w-80'>
            <CardHeader className='flex h-28 w-80 flex-col justify-between md:w-full'>
              <div className='mt-5 flex flex-col items-center justify-between gap-3 lg:flex-col'>
                <div className='mb-1 flex w-full flex-row items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Megaphone className='h-6 w-6' />
                  </div>

                  <div className='flex w-full items-center justify-end gap-2 text-xs text-muted-foreground underline'>
                    <span>Mais Informações</span>
                    <GrCircleAlert size={15} />
                  </div>
                </div>

                <hr className='h-[2px] w-full bg-[#70c08b]' />
              </div>
            </CardHeader>
            <CardContent className='flex w-full flex-row flex-wrap items-center justify-between'>
              <div className='flex flex-col'>
                <p>Custos de Marketing (R$)</p>
                <div className='flex items-center gap-2 text-2xl'>
                  <span className='text-[20px] font-bold text-[#70c08b]'>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                      .format(0)
                      .toString()}
                  </span>
                  <TrendingUpIcon fill='#ffeb3b' color='#ffeb3b' />
                </div>
              </div>

              <ResponsiveContainer width='30%' height={60} className='md:w-40%'>
                <BarChart barSize={10} data={stat.chart}>
                  <Bar dataKey='sale' fill={stat.fill} radius={1} />
                </BarChart>
              </ResponsiveContainer>

              <hr className='mt-6 h-[2px] w-full bg-[#70c08b]' />
            </CardContent>
            <CardFooter className='flex flex-col'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <SwitchCards checked className='cursor-default' />

                  <span>Facebook Ads:</span>
                </div>
                <span className='font-bold'>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(0)}
                </span>
              </div>

              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <SwitchCards disabled />

                  <span className='text-muted-foreground'>TikTok Ads:</span>
                </div>
                <span className='text-muted-foreground'>Em breve</span>
              </div>
              <div className='flex w-full items-center justify-between'>
                <div className='items.center flex gap-2'>
                  <SwitchCards disabled />

                  <span className='text-muted-foreground'>Google Ads:</span>
                </div>
                <span className='text-muted-foreground'>Em breve</span>
              </div>
              <div className='flex h-6 w-full items-center justify-between' />
            </CardFooter>
            <SheetDashboard open={showSheet} onOpenChange={setShowSheet} />
          </Card>
        </div>
      ) : isError ? (
        <Card className='flex h-96 w-80 flex-col md:h-auto md:w-[360px] lg:w-full lg:min-w-80'>
          <CardHeader className='flex h-28 w-80 flex-col justify-between md:w-full'>
            <div className='mt-5 flex flex-col items-center justify-between gap-3 lg:flex-col'>
              <div className='mb-1 flex w-full flex-row items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Megaphone className='h-6 w-6' />
                </div>

                <div className='flex w-full items-center justify-end gap-2 text-xs text-muted-foreground underline'>
                  <span>Mais Informações</span>
                  <GrCircleAlert size={15} />
                </div>
              </div>

              <hr className='h-[2px] w-full bg-[#70c08b]' />
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

            <hr className='mt-6 h-[2px] w-full bg-[#70c08b]' />
          </CardContent>
          <CardFooter className='flex flex-col'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-2'>
                <SwitchCards disabled className='cursor-default' />

                <span>Facebook Ads:</span>
              </div>
              <span className='font-bold'>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(0)}
              </span>
            </div>

            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-2'>
                <SwitchCards disabled />

                <span className='text-muted-foreground'>TikTok Ads:</span>
              </div>
              <span className='text-muted-foreground'>Em breve</span>
            </div>
            <div className='flex w-full items-center justify-between'>
              <div className='items.center flex gap-2'>
                <SwitchCards disabled />

                <span className='text-muted-foreground'>Google Ads:</span>
              </div>
              <span className='text-muted-foreground'>Em breve</span>
            </div>
            <div className='flex h-6 w-full items-center justify-between' />
          </CardFooter>
        </Card>
      ) : (
        <Card className='flex h-96 w-80 flex-col md:h-auto md:w-[360px] lg:w-full lg:min-w-80'>
          <CardHeader className='flex h-28 w-80 flex-col justify-between md:w-full'>
            <div className='mt-5 flex flex-col items-center justify-between gap-3 lg:flex-col'>
              <div className='mb-1 flex w-full flex-row items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {isLoadingShopifyDashboardData ? (
                    <Skeleton className='h-6 w-6' />
                  ) : (
                    <Megaphone className='h-6 w-6' />
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
                <hr className='h-[2px] w-full bg-[#70c08b]' />
              )}
            </div>
          </CardHeader>
          <CardContent className='flex w-full flex-row flex-wrap items-center justify-between'>
            <div className='flex flex-col'>
              {isLoadingShopifyDashboardData ? (
                <Skeleton className='h-4 w-20' />
              ) : (
                <p>Custos de Marketing (R$)</p>
              )}

              <div className='flex items-center gap-2 text-2xl'>
                {isLoadingShopifyDashboardData ? (
                  <Skeleton className='mt-2 h-8 w-24' />
                ) : (
                  <>
                    <span className='text-[20px] font-bold text-[#70c08b]'>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                        .format(totalAdCosts)
                        .toString()}
                    </span>
                    <TrendingUpIcon fill='#ffeb3b' color='#ffeb3b' />
                  </>
                )}
              </div>
            </div>

            {isLoadingShopifyDashboardData ? (
              <Skeleton className='h-14 w-24' />
            ) : (
              <ResponsiveContainer width='30%' height={60} className='md:w-40%'>
                <BarChart barSize={10} data={stat.chart}>
                  <Bar dataKey='sale' fill={stat.fill} radius={1} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {isLoadingShopifyDashboardData ? (
              <Skeleton className='mt-6 h-[0.125rem] w-full' />
            ) : (
              <hr className='mt-6 h-[2px] w-full bg-[#70c08b]' />
            )}
          </CardContent>
          <CardFooter className='flex flex-col'>
            {isLoadingShopifyDashboardData ? (
              <>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-5 rounded-full' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                  <Skeleton className='h-4 w-20' />
                </div>
                <div className='mt-1 flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-5 rounded-full' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                  <Skeleton className='h-4 w-20' />
                </div>
                <div className='mt-1 flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-5 rounded-full' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                  <Skeleton className='h-4 w-20' />
                </div>
                <div className='mt-1 flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-5 rounded-full' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                  <Skeleton className='h-4 w-20' />
                </div>
              </>
            ) : (
              <>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <SwitchCards
                      checked={includeFacebookCampaignCosts}
                      onCheckedChange={() =>
                        toggleIncludeFacebookCampaignCosts()
                      }
                    />

                    <span>Facebook Ads:</span>
                  </div>
                  <span className='font-bold'>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(totalFacebookCampaignCost)}
                  </span>
                </div>

                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <SwitchCards disabled />

                    <span className='text-muted-foreground'>TikTok Ads:</span>
                  </div>
                  <span className='text-muted-foreground'>Em breve</span>
                </div>
                <div className='flex w-full items-center justify-between'>
                  <div className='items.center flex gap-2'>
                    <SwitchCards disabled />

                    <span className='text-muted-foreground'>Google Ads:</span>
                  </div>
                  <span className='text-muted-foreground'>Em breve</span>
                </div>
              </>
            )}
          </CardFooter>
          <SheetDashboard open={showSheet} onOpenChange={setShowSheet} />
        </Card>
      )}
    </>
  )
}
