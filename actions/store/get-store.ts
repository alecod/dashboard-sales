'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const getStoreFetch = actionClient
	.schema(
		z.object({
			user_id: z.string().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { user_id } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(
			`${process.env.API_URL}/app/p/store/owner/${user_id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: String(token),
				},
			},
		)

		if (!res.ok) {
			throw new Error('Error when searching for registered store')
		}

		const data = await res.json()
		return data
	})
