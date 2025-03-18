'use server'

import { actionClient } from '@/lib/safe-action'
import { signInSchema } from '@/validators/auth'

export const createLoginFetch = actionClient
	.schema(signInSchema)
	.action(async ({ parsedInput }) => {
		const { email, password } = parsedInput

		const res = await fetch(`${process.env.API_URL}/app/auth/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		})

		if (!res.ok) {
			throw new Error('Error when logging in. check the data and try again')
		}

		return await res.json()
	})
