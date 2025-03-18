'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const createDefineFacebookAdsFetch = actionClient
	.schema(
		z.object({
			store_cod: z.number(),
			adAccounts: z.array(z.string()).min(1),
			pixels: z.array(z.string()).min(1),
			bms: z.array(z.string().min(1)),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { store_cod, adAccounts, bms, pixels } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(
			`${process.env.API_URL}/app/p/facebook/integration/${store_cod}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: String(token),
				},
				body: JSON.stringify({
					store_cod,
					adAccounts,
					bms,
					pixels,
				}),
			},
		)

		if (!res.ok) {
			throw new Error('Error when deleting fees and taxes')
		}

		const data = await res.json()

		return data
	})
