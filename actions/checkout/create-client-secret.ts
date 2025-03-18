'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const createClientSecretStripeFetch = actionClient
	.schema(
		z.object({
			user_id: z.string().optional(),
			price_id: z.string().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { user_id, price_id } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(`${process.env.API_URL}/app/p/checkout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: String(token),
			},
			body: JSON.stringify({
				user_id,
				price_id,
			}),
		})

		if (!res.ok) {
			throw new Error('Error when create new store')
		}

		const data = await res.json()
		return data
	})
