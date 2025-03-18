'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export type EventsResponse = {
	PageView: number
	ViewContent: number
	AddToCart: number
	InitiateCheckout: number
	AddPaymentInfo: number
	Purchase: number
	Click: number
}

export const getEventsFetch = actionClient
	.schema(
		z.object({
			store_cod: z.number().optional(),
		}),
	)
	.action(async ({ parsedInput }): Promise<EventsResponse> => {
		const { store_cod } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(
			`${process.env.API_URL}/app/facebook/${store_cod}/events`,
			{
				method: 'GET',
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
					Authorization: String(token),
				},
			},
		)

		if (!res.ok) {
			throw new Error('Error on get analytics data')
		}
		const data = await res.json()

		return data
	})
