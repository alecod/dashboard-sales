'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const getSessionIdStripeFetch = actionClient
	.schema(
		z.object({
			sessionId: z.string(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { sessionId } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(
			`${process.env.API_URL}/app/p/checkout/${sessionId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: String(token),
				},
			},
		)
		if (!res.ok) {
			throw new Error('Error obtaining token for password change')
		}
		const data = res.json()
		return data
	})
