'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const createFacebookAdsFetch = actionClient
	.schema(
		z.object({
			store_cod: z.number(),
			access_token: z.string(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { store_cod, access_token } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(
			`${process.env.API_URL}/app/p/facebook/integration`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: String(token),
				},
				body: JSON.stringify({
					store_cod,
					access_token,
				}),
			},
		)

		if (!res.ok) {
			throw new Error('Error when deleting fees and taxes')
		}

		const data = await res.json()

		return data
	})
