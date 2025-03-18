'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const getEcommerceFetch = actionClient
	.schema(
		z.object({
			store_cod: z.number().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { store_cod } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(
			`${process.env.API_URL}/app/p/ecommerce-integration/${store_cod}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: String(token),
				},
			},
		)

		if (!res.ok) {
			throw new Error('Error when fetching platform integration data')
		}

		const data = await res.json()

		return data
	})
