'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'

export const getRegionsAnalyticsFetch = actionClient
	.schema(
		z.object({
			domain: z.string().optional(),
			period: z.string().optional(),
			date: z.string().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { domain, date, period } = parsedInput
		const res = await fetch(
			`${process.env.API_URL}/track/api/stats/${domain}/regions??period=${period}&date=${date}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: String(process.env.PLAUSIBLE_TOKEN),
				},
			},
		)

		if (!res.ok) {
			throw new Error('Error on get analytics data')
		}

		return await res.json()
	})
