'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const getShopifyOrdersDataFetch = actionClient
	.schema(
		z.object({
			store_cod: z.number(),
			startDate: z.string(),
			endDate: z.string(),
			status: z.string(),
			pageIndex: z.number(),
			limit: z.number(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { endDate, startDate, status, store_cod, limit, pageIndex } =
			parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(
			`${process.env.API_URL}/app/p/shopify/${
				store_cod
			}/orders?startDate=${startDate}&endDate=${endDate}&status=${status}&limit=${limit}&offset=${pageIndex * limit}`,
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
