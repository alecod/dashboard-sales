'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const getShopifyDashboardDataFetch = actionClient
	.schema(
		z.object({
			store_cod: z.number(),
			startDate: z.string(),
			endDate: z.string(),
			status: z.string(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { endDate, startDate, status, store_cod } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(
			`${process.env.API_URL}/app/p/shopify/${store_cod}/finance?startDate=${startDate}&endDate=${endDate}&status=${status}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: String(token),
				},
			},
		)

		if (!res.ok) {
			throw new Error('Error when fetching data for the Shopify dashboard')
		}

		return await res.json()
	})
