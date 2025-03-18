'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { ENV } from '@/env/env-store'
import {
  type FacebookAdsData,
  useFacebookAdsDataHook,
} from '@/hooks/facebook-ads-data-hook'
import { useStoreHook } from '@/hooks/store-hook'
import LogoFB from '@/public/images/logo.webp'
import { LockClosedIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { GrCircleAlert } from 'react-icons/gr'
import { Button } from '../ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Skeleton } from '../ui/skeleton'
import { toast } from '../ui/use-toast'

const getActionValue = (
  actions: { type: string; value: string; cost?: string | null }[] | null,
  type: string,
) => {
  const action = actions?.find((action) => action.type === type)
  return action ? action.value : 'N/A'
}

const getActionCost = (
  actions: { type: string; value: string; cost?: string | null }[] | null,
  type: string,
) => {
  const action = actions?.find((action) => action.type === type)
  return action?.cost
    ? `R$ ${Number.parseFloat(action.cost).toFixed(2)}`
    : 'N/A'
}

export function FacebookAdsTable() {
  const {
    setFacebookAdsData,
    facebookAdsData,
    clearFacebookAdsData,
    total_events_sent,
  } = useFacebookAdsDataHook()
  const { selectedStore } = useStoreHook()
  const { API_URL } = ENV()
  const token = Cookies.get('k_a_t')
  const [selectedBmId, setSelectedBmId] = useState<string | undefined>()
  const [selectedAccountId, setSelectedAccountId] = useState<
    string | undefined
  >()

  const {
    data: dataFB,
    refetch: refetchFB,
    isFetching,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['facebook-ads-data', selectedStore?.store_cod],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<{
      data: FacebookAdsData[]
      total_events_sent: number
    }> => {
      const response = await fetch(
        `${API_URL}/app/p/facebook/${selectedStore?.store_cod}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: String(token),
          },
        },
      )
      if (!response.ok) {
        throw new Error('Erro ao carregar integração facebook ads')
      }
      return await response.json()
    },
  })

  useEffect(() => {
    if (dataFB) {
      setFacebookAdsData(dataFB.data, dataFB.total_events_sent)
    } else {
      clearFacebookAdsData()
    }
  }, [dataFB, setFacebookAdsData, clearFacebookAdsData])

  const { mutateAsync: updateDataFB, isPending: isUpdating } = useMutation({
    mutationKey: ['facebook-ads-update-data', selectedStore?.store_cod],
    retry: 0,
    mutationFn: async () => {
      const response = await fetch(
        `${API_URL}/app/p/facebook/${selectedStore?.store_cod}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: String(token),
          },
          body: JSON.stringify({}),
        },
      )
      return await response.json()
    },
    onSuccess() {
      toast({
        title: 'Dados da campanha atualizados com sucesso',
        variant: 'success',
      })
      refetchFB()
    },
    onError() {
      toast({
        title: 'Erro ao atualizar dados da campanha, tente novamente',
        variant: 'destructive',
      })
    },
  })

  const handleUpdateData = async () => {
    try {
      await updateDataFB()
    } catch (error) {
      console.error('Failed to update data:', error)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (dataFB && dataFB.data.length > 0) {
      setSelectedBmId(dataFB.data[0].bm_id)
      if (dataFB.data[0].ad_accounts && dataFB.data[0].ad_accounts.length > 0) {
        setSelectedAccountId(dataFB.data[0].ad_accounts[0].account_id)
      }
    } else {
      clearFacebookAdsData()
    }
  }, [dataFB])

  const selectedBm =
    facebookAdsData?.find((bm) => bm.bm_id === selectedBmId) ?? null
  const selectedAccount =
    selectedBm?.ad_accounts?.find(
      (acc) => acc.account_id === selectedAccountId,
    ) ?? null
  const campaigns = selectedAccount?.info?.campaigns ?? []

  return (
    <div className='mt-10 flex flex-col gap-3'>
      <div className='itens-start flex w-full flex-col lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex w-full flex-col items-start gap-5 lg:flex-row lg:items-center'>
          <div>
            <span className='mb-3 text-sm'>
              Selecione seu Business Manager (BM):
            </span>
            <Select
              value={selectedBmId || undefined}
              onValueChange={(value) => setSelectedBmId(value)}
            >
              <SelectTrigger className='mt-3'>
                <span>
                  {(facebookAdsData &&
                    facebookAdsData.length > 0 &&
                    facebookAdsData.find((bm) => bm.bm_id === selectedBmId)
                      ?.bm_name) ||
                    'Selecione uma BM'}
                </span>
              </SelectTrigger>
              <SelectContent>
                {facebookAdsData &&
                  facebookAdsData.length > 0 &&
                  facebookAdsData.map((bm: FacebookAdsData) => (
                    <SelectItem key={bm.bm_id} value={bm.bm_id}>
                      {bm.bm_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className='mb-3 text-sm'>
              Selecione sua conta de anúncio:
            </span>
            <Select
              value={selectedAccountId || undefined}
              onValueChange={(value) => setSelectedAccountId(value)}
              disabled={!selectedBmId}
            >
              <SelectTrigger className='mt-3'>
                <span>
                  {facebookAdsData && selectedBmId
                    ? facebookAdsData
                        .find((bm) => bm.bm_id === selectedBmId)
                        ?.ad_accounts.find(
                          (acc) => acc.account_id === selectedAccountId,
                        )?.account_name || 'Selecione uma conta'
                    : 'Selecione uma conta'}
                </span>
              </SelectTrigger>
              <SelectContent>
                {facebookAdsData &&
                  selectedBmId &&
                  facebookAdsData
                    .find((bm) => bm.bm_id === selectedBmId)
                    ?.ad_accounts.map((account) => (
                      <SelectItem
                        key={account.account_id}
                        value={account.account_id}
                      >
                        {account.account_name}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center gap-3 pt-0 lg:pt-12'>
            <Image src={LogoFB} alt='Logo Facebook' width={40} />
            <p className='inline-block font-bold'>
              Pixel - Eventos do Servidor:{' '}
              <span className='font-normal'>
                {total_events_sent === 0 ? 'N/A' : total_events_sent}
              </span>
            </p>
          </div>
        </div>

        <div className='flex w-full justify-end pt-2 lg:pt-10'>
          <Button
            variant='outline'
            onClick={handleUpdateData}
            disabled={isUpdating || isFetching}
          >
            Atualizar Dados
          </Button>
        </div>
      </div>
      <div className='container mx-auto mt-0 p-0 lg:mt-5'>
        <div className='scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 overflow-x-auto'>
          <div className='min-w-[2465px]'>
            <div className='flex flex-col'>
              <div className='flex border-b bg-kirofy-white font-medium text-muted-foreground dark:bg-kirofy-greenDark'>
                <div className='flex w-80 items-center justify-center border-r border-kirofy-white/20 p-4 text-sm'>
                  Nome da Campanha
                </div>
                <div className='flex w-48 items-center justify-center border-r border-kirofy-white/20 text-sm'>
                  Status da Campanha
                </div>
                <div className='flex w-48 items-center justify-center border-r border-kirofy-white/20 text-sm'>
                  Alcance
                </div>
                <div className='flex w-48 items-center justify-center border-r border-kirofy-white/20 text-sm'>
                  Gasto
                </div>
                <div className='flex w-48 items-center justify-center border-r border-kirofy-white/20 text-sm'>
                  Impressões
                </div>
                <div className='flex w-48 items-center justify-center gap-2 border-r border-kirofy-white/20 text-sm'>
                  CPM
                  <HoverCard>
                    <HoverCardTrigger>
                      <GrCircleAlert size={15} />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      Custo por mil impressões
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className='flex w-48 items-center justify-center gap-2 border-r border-kirofy-white/20 text-sm'>
                  ROAS
                  <HoverCard>
                    <HoverCardTrigger>
                      <GrCircleAlert size={15} />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      Retorno sobre os gastos com anúncios
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className='flex w-56 items-center justify-center border-r border-kirofy-white/20 text-sm'>
                  Cliques no Link
                </div>
                <div className='flex w-32 items-center justify-center gap-2 border-r border-kirofy-white/20 text-sm'>
                  CTR
                  <HoverCard>
                    <HoverCardTrigger>
                      <GrCircleAlert size={15} />
                    </HoverCardTrigger>
                    <HoverCardContent>Taxa de cliques no link</HoverCardContent>
                  </HoverCard>
                </div>
                <div className='flex w-32 items-center justify-center gap-2 border-r border-kirofy-white/20 text-sm'>
                  CPA
                  <HoverCard>
                    <HoverCardTrigger>
                      <GrCircleAlert size={15} />
                    </HoverCardTrigger>
                    <HoverCardContent>Custo por ação</HoverCardContent>
                  </HoverCard>
                </div>
                <div className='flex w-32 items-center justify-center gap-2 border-r border-kirofy-white/20 text-sm'>
                  AC
                  <HoverCard>
                    <HoverCardTrigger>
                      <GrCircleAlert size={15} />
                    </HoverCardTrigger>
                    <HoverCardContent>Adicionou ao carrinho</HoverCardContent>
                  </HoverCard>
                </div>
                <div className='flex w-32 items-center justify-center gap-2 border-r border-kirofy-white/20 text-sm'>
                  CAC
                  <HoverCard>
                    <HoverCardTrigger>
                      <GrCircleAlert size={15} />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      Custo por adicionar no carrinho
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className='flex w-32 items-center justify-center gap-2 border-r border-kirofy-white/20 text-sm'>
                  IDC
                  <HoverCard>
                    <HoverCardTrigger>
                      <GrCircleAlert size={15} />
                    </HoverCardTrigger>
                    <HoverCardContent>Inicializou Checkout</HoverCardContent>
                  </HoverCard>
                </div>
                <div className='flex w-32 items-center justify-center gap-2 text-sm'>
                  CIC
                  <HoverCard>
                    <HoverCardTrigger>
                      <GrCircleAlert size={15} />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      Custo por Inicializar o Checkout
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>

              {isPending || isUpdating ? (
                <div className='flex flex-col'>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={Number(index)}
                      className='flex h-16 w-full items-center justify-between bg-[#f8f9faff] dark:bg-[#09171d]'
                    >
                      <div className='flex w-80 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-48 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-48 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-48 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-48 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-48 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-48 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-56 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-32 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-32 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-32 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-32 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-32 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                      <div className='flex w-32 items-center justify-center'>
                        <Skeleton className='h-4 w-3/4' />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className='flex flex-col items-center justify-center p-10 dark:bg-[#09171d]'>
                  <LockClosedIcon
                    className='text-gray-400 mr-2 h-8 w-8'
                    color='#94A3B8'
                  />
                  <p className='mt-3 text-lg text-muted-foreground'>
                    Para visualizar a tabela integre com o Facebook Ads
                  </p>
                  <Button className='mt-5'>Integrações</Button>
                </div>
              ) : selectedAccountId && facebookAdsData ? (
                campaigns.length > 0 ? (
                  <div className='h-auto overflow-y-auto dark:bg-[#09171d]'>
                    <Accordion type='multiple' className='overflow-hidden'>
                      {facebookAdsData &&
                        facebookAdsData.length > 0 &&
                        facebookAdsData
                          ?.find(
                            (bm: { bm_id: string }) =>
                              bm.bm_id === selectedBmId,
                          )
                          ?.ad_accounts.find(
                            (acc: { account_id: string }) =>
                              acc.account_id === selectedAccountId,
                          )
                          ?.info?.campaigns?.map((campaign) => (
                            <AccordionItem
                              key={campaign.id}
                              value={campaign.id}
                              className='p-0 py-0'
                            >
                              <AccordionTrigger className='bg-[#f8f9faff] p-0 py-0 font-medium dark:bg-[#112c37]'>
                                <div className='flex h-24 w-80 items-center justify-center border-r border-kirofy-white/20 px-4 text-left'>
                                  <ChevronDown
                                    size={20}
                                    className='relative right-2'
                                  />
                                  <span className='relative font-bold'>
                                    {campaign.name.toLowerCase()}
                                  </span>
                                </div>
                                <div className='flex h-24 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {'N/A'}
                                </div>
                                <div className='flex h-24 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {campaign.insights?.reach || 'N/A'}
                                </div>
                                <div className='flex h-24 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {campaign.insights?.spend
                                    ? `R$ ${Number.parseFloat(
                                        campaign.insights.spend,
                                      ).toFixed(2)}`
                                    : 'N/A'}
                                </div>
                                <div className='flex h-24 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {campaign.insights?.impressions || 'N/A'}
                                </div>
                                <div className='flex h-24 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {campaign.insights
                                    ?.cost_per_thousand_impressions
                                    ? `R$ ${Number.parseFloat(
                                        campaign.insights
                                          .cost_per_thousand_impressions,
                                      ).toFixed(2)}`
                                    : 'N/A'}
                                </div>
                                <div className='flex h-24 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {campaign.insights?.purchase_roas?.find(
                                    (val: { action_type: string }) =>
                                      val.action_type === 'omni_purchase',
                                  )
                                    ? Number.parseFloat(
                                        campaign.insights?.purchase_roas?.find(
                                          (val: { action_type: string }) =>
                                            val.action_type === 'omni_purchase',
                                        )?.value ?? '',
                                      ).toFixed(2)
                                    : 'N/A'}
                                </div>
                                <div className='flex h-24 w-56 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {campaign.insights?.link_clicks || 'N/A'}
                                </div>
                                <div className='flex h-24 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {campaign.insights?.click_through_rate
                                    ? `${Number.parseFloat(
                                        campaign.insights.click_through_rate,
                                      ).toFixed(2)}%`
                                    : 'N/A'}
                                </div>
                                <div className='flex h-24 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {getActionCost(
                                    campaign.insights?.actions ?? null,
                                    'cost_per_action',
                                  )}
                                </div>
                                <div className='flex h-24 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {getActionValue(
                                    campaign.insights?.actions ?? null,
                                    'add_to_cart',
                                  )}
                                </div>
                                <div className='flex h-24 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {getActionCost(
                                    campaign.insights?.actions ?? null,
                                    'add_to_cart',
                                  )}
                                </div>
                                <div className='flex h-24 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                  {getActionValue(
                                    campaign.insights?.actions ?? null,
                                    'initiate_checkout',
                                  )}
                                </div>
                                <div className='flex h-24 w-32 items-center justify-center px-4'>
                                  {getActionCost(
                                    campaign.insights?.actions ?? null,
                                    'initiate_checkout',
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                {campaign.sets?.map((adSet) => (
                                  <Accordion
                                    key={adSet.id}
                                    type='multiple'
                                    className='bg-[#e7ebeeff] dark:bg-[#0d212a]'
                                  >
                                    <AccordionItem value={adSet.id}>
                                      <AccordionTrigger className='flex flex-row border-none py-0'>
                                        <div className='flex h-16 w-80 items-center justify-center border-r border-kirofy-white/20 px-4 text-left'>
                                          <ChevronDown
                                            size={20}
                                            className='relative right-2'
                                          />
                                          <span>{adSet.name}</span>
                                        </div>
                                        <div className='flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {'N/A'}
                                        </div>
                                        <div className='flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {adSet.insights?.reach || 'N/A'}
                                        </div>
                                        <div className='flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {adSet.insights?.spend
                                            ? `R$ ${Number.parseFloat(
                                                adSet.insights.spend,
                                              ).toFixed(2)}`
                                            : 'N/A'}
                                        </div>
                                        <div className='flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {adSet.insights?.impressions || 'N/A'}
                                        </div>
                                        <div className='flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {adSet.insights
                                            ?.cost_per_thousand_impressions
                                            ? `R$ ${Number.parseFloat(
                                                adSet.insights
                                                  .cost_per_thousand_impressions,
                                              ).toFixed(2)}`
                                            : 'N/A'}
                                        </div>
                                        <div className='flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {adSet.insights?.purchase_roas?.find(
                                            (val: { action_type: string }) =>
                                              val.action_type ===
                                              'omni_purchase',
                                          )
                                            ? Number.parseFloat(
                                                adSet.insights?.purchase_roas?.find(
                                                  (val: {
                                                    action_type: string
                                                  }) =>
                                                    val.action_type ===
                                                    'omni_purchase',
                                                )?.value ?? '',
                                              ).toFixed(2)
                                            : 'N/A'}
                                        </div>
                                        <div className='flex h-16 w-56 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {adSet.insights?.link_clicks || 'N/A'}
                                        </div>
                                        <div className='flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {adSet.insights?.click_through_rate
                                            ? `${Number.parseFloat(
                                                adSet.insights
                                                  .click_through_rate,
                                              ).toFixed(2)}%`
                                            : 'N/A'}
                                        </div>
                                        <div className='flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {getActionCost(
                                            adSet.insights?.actions ?? null,
                                            'cost_per_action',
                                          )}
                                        </div>
                                        <div className='flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {getActionValue(
                                            adSet.insights?.actions ?? null,
                                            'add_to_cart',
                                          )}
                                        </div>
                                        <div className='flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {getActionCost(
                                            adSet.insights?.actions ?? null,
                                            'add_to_cart',
                                          )}
                                        </div>
                                        <div className='flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {getActionValue(
                                            adSet.insights?.actions ?? null,
                                            'initiate_checkout',
                                          )}
                                        </div>
                                        <div className='flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                          {getActionCost(
                                            adSet.insights?.actions ?? null,
                                            'initiate_checkout',
                                          )}
                                        </div>
                                      </AccordionTrigger>

                                      <AccordionContent className='bg-[#e7ebeeff] dark:bg-[#09171d]'>
                                        {// @ts-ignore
                                        adSet.ads?.map((ad) => (
                                          <div
                                            key={ad.id}
                                            className='flex items-center'
                                          >
                                            <div className='flex h-16 w-80 items-center justify-center border-r border-kirofy-white/20 p-4 px-4 text-left'>
                                              {ad.name}
                                            </div>
                                            <div className='flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {'N/A'}
                                            </div>
                                            <div className='itens-center flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {ad.insights?.reach || 'N/A'}
                                            </div>
                                            <div className='itens-center flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {ad.insights?.spend
                                                ? `R$ ${Number.parseFloat(
                                                    ad.insights.spend,
                                                  ).toFixed(2)}`
                                                : 'N/A'}
                                            </div>
                                            <div className='itens-center flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {ad.insights?.impressions ||
                                                'N/A'}
                                            </div>
                                            <div className='itens-center flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {ad.insights
                                                ?.cost_per_thousand_impressions
                                                ? `R$ ${Number.parseFloat(
                                                    ad.insights
                                                      .cost_per_thousand_impressions,
                                                  ).toFixed(2)}`
                                                : 'N/A'}
                                            </div>
                                            <div className='itens-center flex h-16 w-48 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {ad.insights?.purchase_roas?.find(
                                                (val: {
                                                  action_type: string
                                                }) =>
                                                  val.action_type ===
                                                  'omni_purchase',
                                              )
                                                ? Number.parseFloat(
                                                    ad.insights?.purchase_roas?.find(
                                                      (val: {
                                                        action_type: string
                                                      }) =>
                                                        val.action_type ===
                                                        'omni_purchase',
                                                    )?.value ?? '',
                                                  ).toFixed(2)
                                                : 'N/A'}
                                            </div>
                                            <div className='itens-center flex h-16 w-56 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {ad.insights?.link_clicks ||
                                                'N/A'}
                                            </div>
                                            <div className='itens-center flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {ad.insights?.click_through_rate
                                                ? `${Number.parseFloat(
                                                    ad.insights
                                                      .click_through_rate,
                                                  ).toFixed(2)}%`
                                                : 'N/A'}
                                            </div>
                                            <div className='itens-center flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {getActionCost(
                                                ad.insights?.actions ?? null,
                                                'cost_per_action',
                                              )}
                                            </div>
                                            <div className='itens-center flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {getActionValue(
                                                ad.insights?.actions ?? null,
                                                'add_to_cart',
                                              )}
                                            </div>
                                            <div className='itens-center flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {getActionCost(
                                                ad.insights?.actions ?? null,
                                                'add_to_cart',
                                              )}
                                            </div>
                                            <div className='itens-center flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {getActionValue(
                                                ad.insights?.actions ?? null,
                                                'initiate_checkout',
                                              )}
                                            </div>
                                            <div className='itens-center flex h-16 w-32 items-center justify-center border-r border-kirofy-white/20 px-4'>
                                              {getActionCost(
                                                ad.insights?.actions ?? null,
                                                'initiate_checkout',
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                    </Accordion>
                  </div>
                ) : (
                  <div className='flex h-64 flex-col items-center justify-center dark:bg-[#09171d]'>
                    <p className='mt-3 text-lg text-muted-foreground'>
                      Sem dados nesta conta de anúncio.
                    </p>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
