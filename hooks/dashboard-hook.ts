import { create } from 'zustand'

export interface Taxes {
  product_cost: string
  product_cost_and_ads: {
    amount_fixed: string
    amount_percentage: string
  }
  profit: {
    amount_fixed: string
    amount_percentage: string
  }
  invoicing: string
  gateway: string
  checkout: string
}

export interface ShopifyDashboardData {
  total_orders: number
  total_paid: number
  total_pending: number
  total_refunded: number
  total_items: number
  total_product_cost: string
  invoicing: {
    paid: string
    cancelled: string
    pending: string
    refunded: string
  }
  marketing: {
    facebook_ads: string
  }
  taxes: {
    product_cost: string
    product_cost_and_ads: {
      amount_fixed: string
      amount_percentage: string
    }
    profit: {
      amount_fixed: string
      amount_percentage: string
    }
    invoicing: string
    gateway: string
    checkout: string
  }
  items_ranking: {
    product_id: number
    variant_id: number
    product_title: string
    variant_title: string
    profit: string
    profit_percentage: string
  }[]
  days: {
    date: string
    orders: {
      total: number
      paid: number
      pending: number
      cancelled: number
      refunded: number
    }
    invoicing: {
      total: string
      paid: string
      cancelled: string
      pending: string
      refunded: string
    }
    taxes: {
      product_cost: string
      product_cost_and_ads: {
        amount_fixed: string
        amount_percentage: string
      }
      profit: {
        amount_fixed: string
        amount_percentage: string
      }
      invoicing: string
      gateway: string
      checkout: string
    }
  }[]
}

interface Dashboardold {
  // Totais
  totalRevenue: number
  totalPorfit: number
  totalPaidOrders: number
  totalPendingOrders: number
  totalCancelledOrders: number
  totalRefundedOrders: number
  totalAdCosts: number
  totalProductCost: number
  totalProductRelatedCosts: number
  totalFacebookCampaignCost: number

  // Estados de inclusão
  includeFacebookCampaignCosts: boolean
  includeProductCosts: boolean
  includePaidOrders: boolean
  includePendingOrders: boolean
  includeCancelledOrders: boolean
  includeRefundedOrders: boolean
  includeTaxes: boolean
  includeCheckoutCosts: boolean
  includePaymentGatewayCosts: boolean

  // Impostos
  dashboardTaxes: Taxes

  // Funções de Toggle
  toggleIncludeFacebookCampaignCosts: () => void
  toggleIncludeProductCosts: () => void
  toggleIncludePaidOrders: () => void
  toggleIncludePendingOrders: () => void
  toggleIncludeCancelledOrders: () => void
  toggleIncludeRefundedOrders: () => void
  toggleIncludeTaxes: () => void
  toggleIncludeCheckoutCosts: () => void
  toggleIncludePaymentGatewayCosts: () => void

  // Funções de Set
  setDashboardTaxes: (value: Taxes) => void
  setDashboardTotals: (value: {
    totalRevenue: number
    totalPaidOrders: number
    totalPendingOrders: number
    totalRefundedOrders: number
    totalCancelledOrders: number
    totalPorfit: number
    totalProductCost: number
    totalProductRelatedCosts: number
    totalAdCosts: number
    totalFacebookCampaignCost: number
  }) => void

  // Shopify Dashboard Data
  shopifyDashboardData: ShopifyDashboardData | null
  isLoadingShopifyDashboardData: boolean
  isIntegratedWithShopify: boolean
  setShopifyDashboardData: (data: ShopifyDashboardData) => void
  setIsLoadingShopifyDashboardData: (loading: boolean) => void
  setIsIntegratedWithShopify: (integrated: boolean) => void
}

export const useDashboardHook = create<Dashboardold>((set) => ({
  // Totais
  totalRevenue: 0.0,
  totalPorfit: 0.0,
  totalPaidOrders: 0.0,
  totalPendingOrders: 0.0,
  totalCancelledOrders: 0.0,
  totalRefundedOrders: 0.0,
  totalProductCost: 0.0,
  totalProductRelatedCosts: 0.0,
  totalFacebookCampaignCost: 0.0,
  totalAdCosts: 0.0,

  // Estados de inclusão
  includeFacebookCampaignCosts: false,
  includeProductCosts: false,
  includePaidOrders: true,
  includePendingOrders: true,
  includeCancelledOrders: true,
  includeRefundedOrders: true,
  includeTaxes: false,
  includeCheckoutCosts: false,
  includePaymentGatewayCosts: false,

  // Impostos
  dashboardTaxes: {
    product_cost: '0.0',
    product_cost_and_ads: {
      amount_fixed: '0.0',
      amount_percentage: '0.0',
    },
    profit: {
      amount_fixed: '0.0',
      amount_percentage: '0.0',
    },
    invoicing: '0.0',
    gateway: '0.0',
    checkout: '0.0',
  },

  // Funções de Toggle
  toggleIncludeFacebookCampaignCosts: () =>
    set((old) => ({
      includeFacebookCampaignCosts: !old.includeFacebookCampaignCosts,
      totalAdCosts: old.includeFacebookCampaignCosts
        ? old.totalAdCosts - old.totalFacebookCampaignCost
        : old.totalAdCosts + old.totalFacebookCampaignCost,
    })),

  toggleIncludeProductCosts: () =>
    set((old) => ({
      includeProductCosts: !old.includeProductCosts,
      totalProductRelatedCosts: old.includeProductCosts
        ? old.totalProductRelatedCosts - old.totalProductCost
        : old.totalProductRelatedCosts + old.totalProductCost,
    })),

  toggleIncludePaidOrders: () =>
    set((old) => ({
      includePaidOrders: !old.includePaidOrders,
      totalRevenue: old.includePaidOrders
        ? old.totalRevenue - old.totalPaidOrders
        : old.totalRevenue + old.totalPaidOrders,
    })),

  toggleIncludePendingOrders: () =>
    set((old) => ({
      includePendingOrders: !old.includePendingOrders,
      totalRevenue: old.includePendingOrders
        ? old.totalRevenue - old.totalPendingOrders
        : old.totalRevenue + old.totalPendingOrders,
    })),

  toggleIncludeCancelledOrders: () =>
    set((old) => ({
      includeCancelledOrders: !old.includeCancelledOrders,
      totalRevenue: old.includeCancelledOrders
        ? old.totalRevenue - old.totalCancelledOrders
        : old.totalRevenue + old.totalCancelledOrders,
    })),

  toggleIncludeRefundedOrders: () =>
    set((old) => ({
      includeRefundedOrders: !old.includeRefundedOrders,
      totalRevenue: old.includeRefundedOrders
        ? old.totalRevenue - old.totalRefundedOrders
        : old.totalRevenue + old.totalRefundedOrders,
    })),

  toggleIncludeTaxes: () =>
    set((old) => ({
      includeTaxes: !old.includeTaxes,
      totalPorfit: old.includeTaxes
        ? old.totalPorfit - Number.parseFloat(old.dashboardTaxes.invoicing)
        : old.totalPorfit + Number.parseFloat(old.dashboardTaxes.invoicing),
    })),

  toggleIncludeCheckoutCosts: () =>
    set((old) => ({
      includeCheckoutCosts: !old.includeCheckoutCosts,
      totalPorfit: old.includeCheckoutCosts
        ? old.totalPorfit - Number.parseFloat(old.dashboardTaxes.checkout)
        : old.totalPorfit + Number.parseFloat(old.dashboardTaxes.checkout),
    })),

  toggleIncludePaymentGatewayCosts: () =>
    set((old) => ({
      includePaymentGatewayCosts: !old.includePaymentGatewayCosts,
      totalPorfit: old.includePaymentGatewayCosts
        ? old.totalPorfit - Number.parseFloat(old.dashboardTaxes.gateway)
        : old.totalPorfit + Number.parseFloat(old.dashboardTaxes.gateway),
    })),

  // Funções de Set
  setDashboardTaxes: (value: Taxes) => set({ dashboardTaxes: value }),

  setDashboardTotals: (value: {
    totalRevenue: number
    totalPaidOrders: number
    totalPendingOrders: number
    totalRefundedOrders: number
    totalCancelledOrders: number
    totalPorfit: number
    totalProductCost: number
    totalProductRelatedCosts: number
    totalAdCosts: number
    totalFacebookCampaignCost: number
  }) => set({ ...value }),

  // Shopify Dashboard Data
  shopifyDashboardData: null,
  isLoadingShopifyDashboardData: true,
  isIntegratedWithShopify: false,

  setShopifyDashboardData: (data) =>
    set({ shopifyDashboardData: data, isLoadingShopifyDashboardData: false }),

  setIsLoadingShopifyDashboardData: (loading) =>
    set({ isLoadingShopifyDashboardData: loading }),

  setIsIntegratedWithShopify: (integrated) =>
    set({ isIntegratedWithShopify: integrated }),
}))
