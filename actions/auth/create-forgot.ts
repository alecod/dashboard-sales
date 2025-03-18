'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'

export const createForgotFetch = actionClient
	.schema(
		z.object({
			email: z.string(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { email } = parsedInput

		const res = await fetch(`${process.env.API_URL}/app/auth/forgot`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email }),
		})

		if (!res.ok) {
			return false
		}

		return true
	})
