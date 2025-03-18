'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const createStoreFetch = actionClient
	.schema(
		z.object({
			owner_id: z.string().optional(),
			name: z.string().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { name, owner_id } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(`${process.env.API_URL}/app/p/store`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: String(token),
			},
			body: JSON.stringify({
				owner_id,
				name,
			}),
		})

		if (!res.ok) {
			throw new Error('Error when create new store')
		}

		const data = await res.json()
		return data
	})
