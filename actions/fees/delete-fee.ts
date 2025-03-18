'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const deleteFeeFetch = actionClient
	.schema(
		z.object({
			fee_cod: z.number().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { fee_cod } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(`${process.env.API_URL}/app/p/fee/${fee_cod}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: String(token),
			},
		})

		if (!res.ok) {
			throw new Error('Error when deleting fees and taxes')
		}

		const data = await res.json()

		return data
	})
