import Cookies from 'js-cookie'
import { create } from 'zustand'

export interface Store {
  owner_id: string
  store_cod: number
  name: string
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

export interface StoreState {
  stores: Store[] | null
  selectedStore: Store | null
  clearStores: () => void
  setStores: (sites: Store[]) => void
  setSelectedStore: (store_cod: number | null) => void
}

const useStoreHook = create<StoreState>((set) => ({
  stores: null,
  selectedStore: null,
  setStores: (stores: Store[]) => set({ stores }),
  clearStores: () => {
    // Limpar estado e cookie
    set({ stores: null, selectedStore: null })
    Cookies.remove('store_registered')
  },
  setSelectedStore: (store_cod: number | null) =>
    set((state) => {
      const selectedStore = !store_cod
        ? null
        : state.stores?.find((site) => site.store_cod === store_cod)

      // Atualizar cookie de status de loja
      Cookies.set('store_registered', selectedStore ? 'true' : 'false')

      return { selectedStore }
    }),
}))

export { useStoreHook }
