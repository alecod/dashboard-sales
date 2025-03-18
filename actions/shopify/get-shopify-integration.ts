'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const getShopifyFetch = actionClient
	.schema(
		z.object({
			ecommerce_integration_cod: z.number().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { ecommerce_integration_cod } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(
			`${process.env.API_URL}/app/p/shopify/integration/${ecommerce_integration_cod}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: String(token),
				},
			},
		)

		if (!res.ok) {
			throw new Error('Error when searching for shopify integration')
		}

		const data = await res.json()

		return data
	})
