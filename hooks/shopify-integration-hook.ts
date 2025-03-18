export interface ShopifyIntegrationInterface {
  ecommerce_integration_cod: number
  shopify_integration_cod: number
  domain: string
  created_at: string
}

export type ShopifyIntegrationState = {
  shopifyIntegration: ShopifyIntegrationInterface | null
  setShopifyIntegration: (
    integration: ShopifyIntegrationInterface | null,
  ) => void
}

import { create } from 'zustand'

const useShopifyIntegrationHook = create<ShopifyIntegrationState>((set) => ({
  shopifyIntegration: null,
  setShopifyIntegration: (integration: ShopifyIntegrationInterface | null) => {
    set({ shopifyIntegration: integration })
  },
}))

export { useShopifyIntegrationHook }
