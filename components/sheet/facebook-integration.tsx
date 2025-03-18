'use client'

import { getFacebookIntegrationFetch } from '@/actions/facebook/get-facebook-integration'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ENV } from '@/env/env-store'
import { useFacebookAdsDataHook } from '@/hooks/facebook-ads-data-hook'
import {
  type FacebookIntegrationInterface,
  useFacebookIntegrationHook,
} from '@/hooks/facebook-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaCheckCircle, FaFacebook } from 'react-icons/fa'
import { z } from 'zod'
import { LoadingModal } from '../global/loading'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from '../ui/use-toast'

const schema = z.object({
  store_cod: z.number(),
  adAccounts: z.array(z.string()).min(1),
  pixels: z.array(
    z.object({
      id: z.string(),
      access_token: z.string(),
    }),
  ),
  bms: z.array(z.string().min(1)),
})

export function SheetFB() {
  const { selectedStore } = useStoreHook()
  const queryClient = useQueryClient()
  const token = Cookies.get('k_a_t')
  const [sendData, setSendData] = useState<{
    adAccounts: string[]
    pixels: {
      id: string
      access_token: string
    }[]
    bms: string[]
  }>({
    adAccounts: [],
    pixels: [
      {
        id: '',
        access_token: '',
      },
    ],
    bms: [],
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      store_cod: selectedStore?.store_cod,
    },
  })

  const [step, setStep] = useState(0)
  const [adAccounts, setAdAccounts] = useState([])
  const [bms, setBms] = useState([])
  const [pixels, setPixels] = useState([])
  const [selectedPixels, setSelectedPixels] = useState<
    { id: string; access_token: string }[]
  >([])

  const {
    facebookIntegration,
    setFacebookIntegration,
    deleteFacebookIntegration,
  } = useFacebookIntegrationHook()
  const { clearFacebookAdsData } = useFacebookAdsDataHook()
  const { API_URL } = ENV()

  useEffect(() => {
    initFacebookSdk().then(() => {
      console.log('Facebook SDK initialized')
    })
  }, [])

  function login() {
    // @ts-ignore
    fbLogin().then(async (response) => {
      return await integrateFacebook({
        // @ts-ignore
        access_token: response.authResponse.accessToken,
      })
    })
  }

  const { data: dataFBIntegration } = useQuery({
    enabled: !!selectedStore?.store_cod,
    queryKey: ['facebook-ads-integration', selectedStore?.store_cod],
    refetchOnWindowFocus: true,
    queryFn: async (): Promise<FacebookIntegrationInterface> => {
      const response = await getFacebookIntegrationFetch({
        store_cod: selectedStore?.store_cod,
      })
      return response?.data
    },
  })

  useEffect(() => {
    if (dataFBIntegration) {
      console.log(dataFBIntegration, 'data')
      setFacebookIntegration(dataFBIntegration)
    }
  }, [dataFBIntegration, setFacebookIntegration])

  const { mutateAsync: integrateFacebook, isPending } = useMutation({
    mutationKey: ['fb-integration', selectedStore?.store_cod],
    mutationFn: async ({ access_token }: { access_token: string }) => {
      const response = await fetch(`${API_URL}/app/p/facebook/integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: String(token),
        },
        body: JSON.stringify({
          access_token,
          store_cod: selectedStore?.store_cod,
        }),
      })
      return await response.json()
    },
    onSuccess(data) {
      setFacebookIntegration({
        integration: data.integration,
        adAccount: false,
        pixel: false,
        bm: false,
      })
      setAdAccounts(data.adAccounts)
      setPixels(data.pixels)
      setBms(data.bms)
      setStep(1)

      form.setValue('store_cod', Number(selectedStore?.store_cod))
    },
  })

  const { data: facebookIntegrationSteps, isPending: stepsLoading } = useQuery({
    enabled:
      !!facebookIntegration &&
      !facebookIntegration.adAccount &&
      !facebookIntegration.bm &&
      !facebookIntegration.pixel &&
      adAccounts.length === 0 &&
      bms.length === 0 &&
      pixels.length === 0,
    queryKey: ['facebookIntegrationSteps', selectedStore?.store_cod],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/app/p/facebook/integration/${selectedStore?.store_cod}/steps`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: String(token),
          },
        },
      )
      if (!response.ok) {
        if (response.status === 404) {
          return
        }
        throw new Error('Facebook Integration not found')
      }
      return await response.json()
    },
    retry: 0,
  })

  useEffect(() => {
    if (
      facebookIntegrationSteps &&
      facebookIntegration &&
      (!facebookIntegration.adAccount ||
        !facebookIntegration.pixel ||
        !facebookIntegration.bm)
    ) {
      setAdAccounts(facebookIntegrationSteps.adAccounts || [])
      setPixels(facebookIntegrationSteps.pixels || [])
      setBms(facebookIntegrationSteps.bms || [])
      if (
        facebookIntegrationSteps.adAccounts &&
        facebookIntegrationSteps.adAccounts.length > 0 &&
        facebookIntegrationSteps.pixels &&
        facebookIntegrationSteps.pixels.length > 0 &&
        facebookIntegrationSteps.bms &&
        facebookIntegrationSteps.bms.length > 0
      ) {
        setStep(1)
      }
    }
  }, [facebookIntegrationSteps, facebookIntegration])

  const { mutateAsync: defineIntegration, isPending: isPendingDefine } =
    useMutation({
      mutationKey: ['define-integration', selectedStore?.store_cod],
      mutationFn: async (data: z.infer<typeof schema>) => {
        const response = await fetch(
          `${API_URL}/app/p/facebook/integration/define`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: String(token),
            },
            body: JSON.stringify({
              ...data,
              pixels: sendData.pixels,
            }),
          },
        )
        if (!response.ok) {
          throw new Error('')
        }
      },
      onSuccess(data) {
        setFacebookIntegration({
          // @ts-ignore
          integration: facebookIntegration?.integration,
          adAccount: true,
          pixel: true,
          bm: true,
        })
        toast({
          title: 'Integração com o Facebook Ads realizada com sucesso!',
          variant: 'success',
        })
        setStep(4)
        setSelectedPixels([])
      },
      onError(error: { message: string | string[] }) {
        toast({
          title: 'Erro ao integrar o Facebook Ads',
          variant: 'destructive',
        })
      },
    })

  const { mutateAsync: handleRemoveIntegration } = useMutation({
    mutationKey: ['deleteFacebookIntegration', selectedStore],
    mutationFn: async () => {
      const response = await fetch(
        `${API_URL}/app/p/facebook/integration/${selectedStore?.store_cod}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: String(token),
          },
        },
      )
      if (!response.ok) {
        throw new Error('Facebook Integration not found')
      }
    },

    onSuccess: () => {
      setStep(0)
      deleteFacebookIntegration()
      clearFacebookAdsData()
      queryClient.removeQueries({
        queryKey: ['facebook-ads-data', selectedStore?.store_cod],
        exact: true,
      })
      queryClient.removeQueries({
        queryKey: ['facebook-ads-integration', selectedStore?.store_cod],
        exact: true,
      })
      toast({
        title: 'Integração com o Facebook removida com sucesso',
        variant: 'success',
      })
    },
    onError: (error: { message: string | string[] }) => {
      toast({
        title: 'Houve um erro ao remover a integração. Tente novamente.',
        variant: 'destructive',
      })
    },
  })

  const handlePixelSelection = (pixelId: string) => {
    if (selectedPixels.find((pixel) => pixel.id === pixelId)) {
      setSelectedPixels((prev) => prev.filter((pixel) => pixel.id !== pixelId))
    } else {
      setSelectedPixels((prev) => [...prev, { id: pixelId, access_token: '' }])
    }
  }

  const handleTokenChange = (pixelId: string, token: string) => {
    setSelectedPixels((prev) =>
      prev.map((pixel) =>
        pixel.id === pixelId ? { ...pixel, access_token: token } : pixel,
      ),
    )
  }

  useEffect(() => {
    form.setValue('pixels', sendData.pixels)
    form.setValue('adAccounts', sendData.adAccounts)
    form.setValue('bms', sendData.bms)
  }, [sendData, form])

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    const pixelsToSend = selectedPixels.filter(
      (pixel) => pixel.id && pixel.access_token,
    ) // Verifica se os pixels estão completos

    await defineIntegration({
      ...data,
      pixels: pixelsToSend, // Usa os pixels corretos no envio
    })
  }
  return (
    <>
      <LoadingModal show={isPendingDefine} />
      <Sheet>
        <SheetOverlay className='flex items-center justify-center bg-kirofy-black bg-opacity-50 backdrop-blur-md' />
        <SheetTrigger asChild>
          <Button type='button'>
            {!facebookIntegration && 'Integrar'}
            {facebookIntegration?.integration &&
              facebookIntegration.adAccount === true &&
              facebookIntegration.pixel === true &&
              facebookIntegration.bm === true &&
              'Integrado'}

            {facebookIntegration?.integration &&
              (facebookIntegration.adAccount === false ||
                facebookIntegration.pixel === false ||
                facebookIntegration.bm === false) &&
              'Continuar'}
          </Button>
        </SheetTrigger>
        <SheetContent>
          {facebookIntegration?.adAccount &&
            facebookIntegration.pixel &&
            facebookIntegration.bm && (
              <div className='mt-4 space-y-4'>
                <div className='flex items-center gap-3'>
                  <FaFacebook size={40} fill='#3b5998' />
                  <div>
                    <h2 className='text-xl font-semibold'>Facebook</h2>
                  </div>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-700'>Tipo:</span>
                    <span>Facebook Ads(Conta de anuncio + Pixel)</span>
                  </div>
                  <Button
                    variant='destructive'
                    onClick={async () => await handleRemoveIntegration()}
                  >
                    Remover Integração
                  </Button>
                </div>
              </div>
            )}

          {(!facebookIntegration ||
            (facebookIntegration &&
              (!facebookIntegration.adAccount ||
                !facebookIntegration.bm ||
                !facebookIntegration.pixel))) && (
            <form
              onSubmit={async (event) => {
                event.preventDefault()

                const pixelsToSend = selectedPixels.filter(
                  (pixel) => pixel.id && pixel.access_token,
                )

                if (pixelsToSend.length === 0) {
                  return
                }

                setSendData((oldData) => ({
                  ...oldData,
                  pixels: pixelsToSend,
                }))

                await defineIntegration({
                  store_cod: Number(selectedStore?.store_cod),
                  adAccounts: sendData.adAccounts,
                  pixels: pixelsToSend,
                  bms: sendData.bms,
                })
              }}
              className='h-dvh overflow-y-auto'
            >
              <SheetHeader>
                <div className='mb-4 flex flex-col items-center justify-start gap-3'>
                  <div className='flex items-center gap-4'>
                    <FaFacebook size={40} fill='#3b5998' />
                    <SheetTitle>Integração com a Facebook Ads</SheetTitle>
                  </div>

                  <p>
                    Nossa plataforma se integra com o Facebook Ads para
                    retroalimentar pixels, coletar métricas de campanhas e
                    otimizar os anúncios dos nossos clientes, permitindo uma
                    gestão eficaz e baseada em dados para maximizar o desempenho
                    publicitário.
                  </p>
                </div>
              </SheetHeader>
              <Accordion
                type='single'
                className='w-full space-y-5'
                value={String(step)}
              >
                <AccordionItem
                  value='0'
                  className={clsx('mt-5 space-y-3', {
                    'opacity-50': step !== 0,
                  })}
                  disabled={step !== 0}
                >
                  <AccordionTrigger className='flex flex-col'>
                    <Label className='text-base font-medium'>
                      Integracao com o Facebook
                    </Label>
                    <p>
                      {step !== 0 ? (
                        <div className='flex items-center gap-3'>
                          <p>Conta conctada com sucesso</p>
                          <FaCheckCircle fill='#28a745' />
                        </div>
                      ) : (
                        'Conecte-se com sua conta do Facebook'
                      )}
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className='flex flex-col'>
                    <Button onClick={login}>
                      {isPending ? 'Integrando...' : 'Conectar'}
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='1'
                  className={clsx('mt-5 space-y-3', {
                    'opacity-50': step !== 1,
                  })}
                  disabled={step !== 1}
                >
                  <AccordionTrigger className='flex w-full flex-col'>
                    <Label className='text-base font-medium'>
                      Selecione sua Bussiness Managment
                    </Label>
                    <p className='w-full text-left'>
                      Escolha as BMs que deseja integrar
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      {
                        //
                        bms.map(
                          (
                            bm: {
                              bm_id: string
                              name: string
                            },
                            i: number,
                          ) => (
                            <div
                              key={Number(i)}
                              className='flex items-center gap-3'
                            >
                              <Input
                                type='checkbox'
                                checked={
                                  !!sendData.bms.find((ad) => bm.bm_id === ad)
                                }
                                className='w-5 cursor-pointer'
                                onChange={(e) => {
                                  if (
                                    sendData.bms.find((ad) => ad === bm.bm_id)
                                  ) {
                                    setSendData((old) => ({
                                      ...old,
                                      bms: old.bms.filter(
                                        (ad) => ad !== bm.bm_id,
                                      ),
                                    }))
                                  } else {
                                    setSendData((old) => ({
                                      ...old,
                                      bms: [...old.bms, bm.bm_id],
                                    }))
                                  }
                                }}
                              />
                              <Label htmlFor={bm.bm_id}>{bm.name}</Label>
                            </div>
                          ),
                        )
                      }
                      <Button
                        onClick={() => setStep(2)}
                        disabled={sendData.bms.length === 0}
                        className='mt-3 w-full'
                      >
                        Avançar
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='2'
                  className={clsx('mt-5 space-y-3', {
                    'opacity-50': step !== 2,
                  })}
                  disabled={step !== 2}
                >
                  <AccordionTrigger className='flex w-full flex-col'>
                    <Label className='text-base font-medium'>
                      Selecione sua conta de anúncio
                    </Label>
                    <p className='w-full text-left'>
                      Escolha a conta de anúncio que deseja integrar
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      {adAccounts
                        .filter(
                          (adAccount: {
                            adaccount_id: string
                            name: string
                            bm_id: string
                          }) => sendData.bms.includes(adAccount.bm_id),
                        )
                        .map(
                          (
                            adAccount: { adaccount_id: string; name: string },
                            i: number,
                          ) => (
                            <div
                              key={Number(i)}
                              className='flex items-center gap-3'
                            >
                              <Input
                                type='checkbox'
                                checked={
                                  !!sendData.adAccounts.find(
                                    (ad) => adAccount.adaccount_id === ad,
                                  )
                                }
                                className='w-5 cursor-pointer'
                                onChange={(e) => {
                                  if (
                                    sendData.adAccounts.find(
                                      (ad) => ad === adAccount.adaccount_id,
                                    )
                                  ) {
                                    setSendData((old) => ({
                                      ...old,
                                      adAccounts: old.adAccounts.filter(
                                        (ad) => ad !== adAccount.adaccount_id,
                                      ),
                                    }))
                                  } else {
                                    setSendData((old) => ({
                                      ...old,
                                      adAccounts: [
                                        ...old.adAccounts,
                                        adAccount.adaccount_id,
                                      ],
                                    }))
                                  }
                                }}
                              />
                              <Label htmlFor={adAccount.adaccount_id}>
                                {adAccount.name}
                              </Label>
                            </div>
                          ),
                        )}
                      <Button
                        onClick={() => setStep(3)}
                        disabled={sendData.adAccounts.length === 0}
                        className='mt-3 w-full'
                      >
                        Avançar
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value='3'
                  className={clsx('mt-5 space-y-3', {
                    'opacity-50': step !== 3,
                  })}
                  disabled={step !== 3}
                >
                  <AccordionTrigger className='flex flex-col'>
                    <Label className='text-base font-medium'>
                      Selecione o Pixel
                    </Label>
                    <p>Escolha com qual pixel deseja integrar</p>
                  </AccordionTrigger>
                  <AccordionContent className='flex flex-col'>
                    <div>
                      {pixels.map(
                        (
                          pixel: {
                            pixel_id: string
                            name: string
                            access_token?: string
                          },
                          i: number,
                        ) => (
                          <div key={Number(i)} className='flex flex-col gap-2'>
                            <div className='flex items-center gap-3'>
                              <Input
                                type='checkbox'
                                checked={
                                  !!selectedPixels.find(
                                    (px) => px.id === pixel.pixel_id,
                                  )
                                }
                                className='w-5 cursor-pointer'
                                onChange={() =>
                                  handlePixelSelection(pixel.pixel_id)
                                }
                              />
                              <Label htmlFor={pixel.pixel_id}>
                                {pixel.name}
                              </Label>
                            </div>
                            {selectedPixels.find(
                              (px) => px.id === pixel.pixel_id,
                            ) && (
                              <div className='mb-3'>
                                <Label>Pixel Token para {pixel.name}</Label>
                                <Input
                                  type='text'
                                  value={
                                    selectedPixels.find(
                                      (px) => px.id === pixel.pixel_id,
                                    )?.access_token || ''
                                  }
                                  onChange={(e) =>
                                    handleTokenChange(
                                      pixel.pixel_id,
                                      e.target.value,
                                    )
                                  }
                                  placeholder='Insira o Access Token'
                                />
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button
                type='submit'
                className='mb-12 mt-5 w-full'
                disabled={
                  selectedPixels.filter(
                    (pixel) => pixel.id && pixel.access_token,
                  ).length === 0
                }
              >
                Finalizar integração
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export const initFacebookSdk = () => {
  return new Promise<void>((resolve) => {
    ;((d, s, id) => {
      // biome-ignore lint/style/noVar: <explanation>
      // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      var js,
        fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      // @ts-ignore
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      // @ts-ignore
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')

    // @ts-ignore
    window.fbAsyncInit = () => {
      // @ts-ignore
      window.FB.init({
        appId: '1026297669077332',
        cookie: true,
        xfbml: true,
        version: 'v20.0',
      })
      resolve()
    }
  })
}

export const getFacebookLoginStatus = () => {
  return new Promise((resolve) => {
    // @ts-ignore
    window.FB.getLoginStatus((response) => {
      resolve(response)
    })
  })
}

export const fbLogin = () => {
  return new Promise((resolve) => {
    // @ts-ignore
    window.FB.login(
      // @ts-ignore
      (response) => {
        resolve(response)
      },
      {
        config_id: '1062086278809438',
        // response_type: 'code',
        // override_default_response_type: true,
      },
    )
  })
}
