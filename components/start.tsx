'use client'
import { getEnv } from '@/env/env'
import { ENV } from '@/env/env-store'
import { useEffect } from 'react'

export function LoadEnv() {
  const { API_URL, setEnv } = ENV()

  useEffect(() => {
    if (!API_URL) {
      getEnv().then((env) => {
        setEnv(
          env as {
            API_URL: string
            STRIPE_PUBLISHABLE_KEY: string
            FRONT_URL: string
            NOVU_BACKEND_URL: string
            NOVU_SOCKET_URL: string
            NOVU_IDENTIFIER: string
            PLAUSIBLE_URL: string
            PLAUSIBLE_TOKEN: string
          },
        )
      })
    }
  }, [API_URL, setEnv])
  return null
}
