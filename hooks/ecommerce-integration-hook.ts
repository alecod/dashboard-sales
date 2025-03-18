export interface EcommerceIntegrationInterface {
  ecommerce_integration_cod: number
  store_cod: number
  type: 'shopify' | 'custom'
  created_at: string
}

export type EcommerceIntegrationState = {
  ecommerceIntegration: EcommerceIntegrationInterface | null
  setEcommerceIntegration: (
    integration: EcommerceIntegrationInterface | null,
  ) => void
  deleteEcommerceIntegration: () => void
}

import { create } from 'zustand'

const useEcommerceIntegrationHook = create<EcommerceIntegrationState>(
  (set) => ({
    ecommerceIntegration: null,
    setEcommerceIntegration: (
      integration: EcommerceIntegrationInterface | null,
    ) => {
      set({ ecommerceIntegration: integration })
    },
    deleteEcommerceIntegration: () => {
      set({ ecommerceIntegration: null })
    },
  }),
)

export { useEcommerceIntegrationHook }
