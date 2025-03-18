'use client'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import { useShopifyIntegrationHook } from '@/hooks/shopify-integration-hook'

const { ecommerceIntegration } = useEcommerceIntegrationHook()
const { shopifyIntegration } = useShopifyIntegrationHook()

export const getHasPlatformIntegration = (): boolean => {
	switch (ecommerceIntegration?.type) {
		case 'shopify':
			return !!shopifyIntegration
	}
	return false
}
