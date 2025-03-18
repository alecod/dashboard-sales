import { create } from 'zustand'

// Definições dos tipos para as ações, insights, anúncios, conjuntos de anúncios e campanhas
export type Action = {
  type: string
  value: string
  cost?: string | null
}

export type Insights = {
  reach: string | null
  spend: string | null
  impressions: string | null
  purchase_roas:
    | [
        {
          action_type: string
          value: string
        },
      ]
    | null
  cost_per_thousand_impressions: string | null
  click_through_rate: string | null
  link_clicks: string | null
  actions: Action[] | null
}

export type Ad = {
  id: string
  name: string
  insights: Insights | null
}

export type AdSet = {
  id: string
  name: string
  insights: Insights | null
  ads: Ad[] | null
}

export type Campaign = {
  id: string
  name: string
  insights: Insights | null
  sets: AdSet[] | null
}

export interface AdAccountInfo {
  adaccount_id: string
  store_cod: number
  searched_at: string
  status: string
  campaigns: Campaign[] | null
}

export interface AdAccount {
  account_id: string
  account_name: string
  info: AdAccountInfo | null
}

export interface FacebookAdsData {
  bm_cod: number
  bm_id: string
  bm_name: string
  ad_accounts: AdAccount[]
}

// Estado da store
export type FacebookAdsDataState = {
  facebookAdsData: FacebookAdsData[] | null
  total_events_sent: number | null
  isPending: boolean
  isError: boolean
  isFetched: boolean
  setStatesAdsData: (states: {
    isPending: boolean
    isError: boolean
    isFetched: boolean
  }) => void
  setFacebookAdsData: (data: FacebookAdsData[], count: number) => void
  clearFacebookAdsData: () => void
}

const useFacebookAdsDataHook = create<FacebookAdsDataState>((set) => ({
  facebookAdsData: null,
  total_events_sent: null,
  isPending: false,
  isError: false,
  isFetched: false,
  setStatesAdsData: (states) => {
    set({
      isPending: states.isPending,
      isError: states.isError,
      isFetched: states.isFetched,
    })
  },
  setFacebookAdsData: (data: FacebookAdsData[], count: number) => {
    set({ facebookAdsData: data, total_events_sent: count })
  },
  clearFacebookAdsData: () => {
    set({ facebookAdsData: null, total_events_sent: null })
  },
}))

export { useFacebookAdsDataHook }
