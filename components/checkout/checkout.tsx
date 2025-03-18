'use client'
import { createClientSecretStripeFetch } from '@/actions/checkout/create-client-secret'
import { ENV } from '@/env/env-store'
import { useAuthHook } from '@/hooks/auth-hook'
import { useStoreHook } from '@/hooks/store-hook'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Cookies from 'js-cookie'
import { useCallback } from 'react'

export function Checkout({ priceID }: { priceID: string }) {
  const { user } = useAuthHook()
  const { selectedStore } = useStoreHook()
  const token = Cookies.get('k_a_t')
  const userid = user?.id
  const priceId = sessionStorage.getItem('priceId')
  const { STRIPE_PUBLISHABLE_KEY, API_URL } = ENV()

  const stripePromise = loadStripe(String(STRIPE_PUBLISHABLE_KEY))

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const fetchClientSecret = useCallback(() => {
    return createClientSecretStripeFetch({
      price_id: priceId as string,
      user_id: user?.id,
    }).then((res) => res?.data)
  }, [priceID, selectedStore, token, userid])

  const options = {
    fetchClientSecret,
  }

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout className='flex w-full items-center justify-start' />
    </EmbeddedCheckoutProvider>
  )
}
