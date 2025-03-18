'use client'
import { getPlansStripeFetch } from '@/actions/checkout/get-plans'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog'
import { ENV } from '@/env/env-store'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { Checkout } from '../checkout'

export function PaymentCard() {
  const [plans, setPlans] = useState<[]>([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [priceId, setPriceId] = useState<string | null>(null)
  const { API_URL } = ENV()

  const { data: plansData } = useQuery({
    enabled: !!API_URL,
    queryKey: ['available-plans'],
    queryFn: async () => {
      const response = await getPlansStripeFetch()
      if (!response?.data) {
        throw new Error('Erro ao buscar os planos')
      }
      return await response.data
    },
  })

  useEffect(() => {
    if (plansData) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const proPlan = plansData.find((plan: any) => plan.name === 'Pro')
      setSelectedPlan(proPlan.id)
      setPlans(plansData)
    }
  }, [plansData])

  const handleOpenCheckout = (priceId: string) => {
    setPriceId(priceId)
    setOpenModal(true)
  }

  return (
    <>
      <h2 className='text-gray-700 mb-[5rem] mt-[3rem] text-center text-3xl font-bold'>
        Selecione seu plano:
      </h2>

      <div className='mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
        {plans.map((plan) => {
          // @ts-ignore
          const monthlyPrice = plan.prices.find(
            // @ts-ignore
            (price) => price.type === 'monthly',
          )?.amount
          // @ts-ignore
          const priceId = plan.prices.find(
            // @ts-ignore
            (price) => price.type === 'monthly',
          )?.price_id

          return (
            <Card
              key={
                // @ts-ignore
                Number(plan.id)
              }
              className={clsx(
                'flex cursor-pointer flex-col justify-between rounded-lg border-2 p-4',
                // @ts-ignore
                selectedPlan && selectedPlan === plan.id
                  ? 'border-[#19dbfe]'
                  : 'border-gray-200',
              )}
              onClick={() => setSelectedPlan(plan)}
            >
              <div>
                <h3 className='text-lg font-semibold'>
                  {
                    // @ts-ignore
                    plan.name
                  }
                </h3>
                <p className='text-2xl font-bold'>
                  R$<span>{monthlyPrice}</span>
                </p>
                <ul className='mt-2 space-y-2'>
                  {
                    // @ts-ignore
                    plan.features.map((feature, index: number) => (
                      <li
                        key={Number(index)}
                        className='flex items-center space-x-2 text-sm'
                      >
                        <FaCheck />
                        <span>{feature.name}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div className='flex w-full flex-col'>
                <Button
                  variant='outline'
                  className='mt-3 w-full p-0'
                  onClick={() => handleOpenCheckout(priceId)}
                >
                  Teste grátis por 7 dias
                </Button>
                <Button
                  variant='default'
                  className='mt-2'
                  onClick={() => handleOpenCheckout(priceId)}
                >
                  Assinar
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogOverlay className='bottom-10 h-full bg-kirofy-black bg-opacity-50 backdrop-blur-md' />
        <DialogContent className='h-[650px] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Checkout - Assinatura Kirofy</DialogTitle>
          </DialogHeader>
          {priceId && <Checkout priceID={priceId} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
