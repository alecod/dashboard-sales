'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'

export const updatePasswordFetch = actionClient
	.schema(
		z.object({
			user_id: z.string().optional(),
			password: z.string(),
			password_confirmation: z.string(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { user_id, password, password_confirmation } = parsedInput

		const res = await fetch(`${process.env.API_URL}/app/auth/change-forgot`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user_id, password, password_confirmation }),
		})

		if (!res.ok) {
			throw new Error('Error when updating new password')
		}

		const data = await res.json()
		return data
	})
