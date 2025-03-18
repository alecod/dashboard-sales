'use client'
import { getEcommerceFetch } from '@/actions/integrations/get-ecommerce-integration'
import { getShopifyFetch } from '@/actions/shopify/get-shopify-integration'
import { getStoreFetch } from '@/actions/store/get-store'
import { type UserInput, useAuthHook } from '@/hooks/auth-hook'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import { useShopifyIntegrationHook } from '@/hooks/shopify-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
export function LoadInitialData({
  refreshToken,
  store,
}: {
  refreshToken?: {
    access_token: string
    refresh_token: string
    user: UserInput
  }
  store?:
    | {
        owner_id: string
        store_cod: number
        name: string
        createdAt: string
        updatedAt: string | null
        deletedAt: string | null
      }[]
    | undefined
}) {
  const { setStores, setSelectedStore, selectedStore } = useStoreHook()
  const { setEcommerceIntegration, ecommerceIntegration } =
    useEcommerceIntegrationHook()
  const { setShopifyIntegration } = useShopifyIntegrationHook()
  const { setUser, user } = useAuthHook()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!refreshToken?.user) {
      Cookies.remove('k_r_t')
      Cookies.remove('k_a_t')
      return
    }

    if (refreshToken) {
      setUser(refreshToken.user)
      Cookies.set('k_r_t', `Bearer ${refreshToken.refresh_token}`)
      Cookies.set('k_a_t', `Bearer ${refreshToken.access_token}`)
    }
  }, [refreshToken, setUser])

  const { data: storeData } = useQuery({
    enabled: !!user,
    queryKey: ['get-store', user?.id],
    initialData: store ?? null,
    queryFn: async () =>
      await getStoreFetch({
        user_id: user ? user.id : undefined,
      }).then((res) => res?.data ?? null),
    staleTime: Number.POSITIVE_INFINITY,
    retry: 0,
    refetchOnWindowFocus: false,
  })

  const { data: ecommerceData, isError: isErrorEcommerce } = useQuery({
    enabled: !!selectedStore,
    queryKey: ['get-ecommerce', selectedStore],
    queryFn: async () => {
      const res = await getEcommerceFetch({
        store_cod: selectedStore ? selectedStore.store_cod : undefined,
      })

      if (res?.serverError) {
        throw new Error('Error')
      }
      return res?.data
    },
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    retry: 0,
    refetchOnWindowFocus: false,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isErrorEcommerce) {
      queryClient.setQueryDefaults(['get-ecommerce', selectedStore], {
        staleTime: Number.POSITIVE_INFINITY,
      })
    }
  }, [isErrorEcommerce])

  const { data: shopifyIntegrationData } = useQuery({
    enabled: !!selectedStore && ecommerceIntegration?.type === 'shopify',
    queryKey: ['get-shopify-integration', ecommerceIntegration, selectedStore],
    queryFn: async () =>
      await getShopifyFetch({
        ecommerce_integration_cod: ecommerceIntegration
          ? ecommerceIntegration.ecommerce_integration_cod
          : undefined,
      }).then((res) => res?.data ?? null),
    staleTime: Number.POSITIVE_INFINITY,
    retry: 0,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (storeData) {
      setStores(storeData)
      setSelectedStore(storeData[0]?.store_cod)
    }
  }, [storeData, setStores, setSelectedStore])

  useEffect(() => {
    if (ecommerceData) {
      setEcommerceIntegration(ecommerceData)
    } else {
      setEcommerceIntegration(null)
    }
  }, [ecommerceData, setEcommerceIntegration])

  useEffect(() => {
    if (shopifyIntegrationData) {
      setShopifyIntegration(shopifyIntegrationData)
    } else {
      setShopifyIntegration(null)
    }
  }, [shopifyIntegrationData, setShopifyIntegration])

  return null
}
