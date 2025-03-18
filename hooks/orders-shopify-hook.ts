// stores/order-store.ts

import { create } from 'zustand'

export interface ShopifyOrdersData {
  data: Array<{
    id: number
    store_cod: number
    type: string
    cod: string
    financial_status: string
    note: string
    items: Array<{
      id: number
      store_cod: number
      title: string
      variants: Array<{
        id: number
        title: string
        price: string
        sku: string
        position: number
        quantity: number
        taxable: boolean
        cost: string | null
        barcode: string | null
        images: Array<{
          id: number
          src: string
          position: number
        }>
      }>
      tags: string[]
      images: Array<{
        id: number
        src: string
        position: number
      }>
      image: {
        id: number
        src: string
        position: number
      }
    }>
    currency: string
    total: string
    subtotal: string
    total_tax_added: string
    total_discounts: string
    tags: string[]
    customer: {
      id: number
      first_name: string
      last_name: string
      email: string
      phone: string
      tags: string[]
      marketing_consent: boolean
      cpf: string | null
    }
    created_at: string
    info: {
      sub_cost: {
        profit_percentage: string
        profit: string
      }
      sub_fees: {
        profit_percentage: string
        profit: string
      }
      sub_all: {
        profit_percentage: string
        profit: string
      }
      total_fee: string
      items_ranking: Array<{
        product_id: number
        variant_id: number
        product_title: string
        variant_title: string
        profit: string
        profit_percentage: string
      }>
      processed_at: string
    }
  }>
}

export interface ShopifyOrdersState {
  shopifyOrdersData: ShopifyOrdersData | null
  isLoadingShopifyOrders: boolean
  setShopifyOrdersData: (data: ShopifyOrdersData) => void
  setIsLoadingShopifyOrders: (loading: boolean) => void
}

const useShopifyOrdersHook = create<ShopifyOrdersState>((set) => ({
  shopifyOrdersData: null,
  isLoadingShopifyOrders: true,
  setShopifyOrdersData: (data) =>
    set({ shopifyOrdersData: data, isLoadingShopifyOrders: false }),
  setIsLoadingShopifyOrders: (loading) =>
    set({ isLoadingShopifyOrders: loading }),
}))

export { useShopifyOrdersHook }
