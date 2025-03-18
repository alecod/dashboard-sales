export interface FacebookIntegrationInterface {
  integration: {
    access_token: string
    store_cod: number
    facebook_integration_cod: number
  }
  adAccount: boolean
  pixel: boolean
  bm: boolean
}

export type FacebookIntegrationState = {
  facebookIntegration: FacebookIntegrationInterface | null
  isPending: boolean
  isError: boolean
  isFetched: boolean
  setStates: (states: {
    isPeding: boolean
    isError: boolean
    isFetched: boolean
  }) => void
  setFacebookIntegration: (
    integration: FacebookIntegrationInterface | null,
  ) => void
  deleteFacebookIntegration: () => void
}

import { create } from 'zustand'

const useFacebookIntegrationHook = create<FacebookIntegrationState>((set) => ({
  facebookIntegration: null,
  isPending: false,
  isError: false,
  isFetched: false,
  setStates: (states: {
    isPeding: boolean
    isError: boolean
    isFetched: boolean
  }) =>
    set({
      isPending: states.isPeding,
      isError: states.isError,
      isFetched: states.isFetched,
    }),
  setFacebookIntegration: (integration: FacebookIntegrationInterface | null) =>
    set({ facebookIntegration: integration }),
  deleteFacebookIntegration: () =>
    set({
      facebookIntegration: null,
      isPending: false,
      isError: false,
      isFetched: false,
    }), // Limpando os estados relacionados
}))

export { useFacebookIntegrationHook }
