'use client'
import { create } from 'zustand'

type EnvType = {
  STRIPE_PUBLISHABLE_KEY: string | undefined
  API_URL: string | undefined
  FRONT_URL: string | undefined
  NOVU_BACKEND_URL?: string
  NOVU_SOCKET_URL?: string
  NOVU_IDENTIFIER?: string
  PLAUSIBLE_URL?: string
  PLAUSIBLE_TOKEN?: string
  setEnv: (value: {
    STRIPE_PUBLISHABLE_KEY: string
    API_URL: string
    FRONT_URL: string
    NOVU_BACKEND_URL?: string
    NOVU_SOCKET_URL?: string
    NOVU_IDENTIFIER?: string
    PLAUSIBLE_URL?: string
    PLAUSIBLE_TOKEN?: string
  }) => void
}

export const ENV = create<EnvType>((set) => ({
  STRIPE_PUBLISHABLE_KEY: undefined,
  API_URL: undefined,
  FRONT_URL: undefined,
  NOVU_BACKEND_URL: undefined,
  NOVU_SOCKET_URL: undefined,
  NOVU_IDENTIFIER: undefined,
  PLAUSIBLE_URL: undefined,
  PLAUSIBLE_TOKEN: undefined,
  setEnv: (value) => {
    return set(value)
  },
}))
