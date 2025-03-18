'use server'

import { actionClient } from '@/lib/safe-action'
import { signUpSchema } from '@/validators/auth'

export const createSignupFetch = actionClient
	.schema(signUpSchema)
	.action(async ({ parsedInput }) => {
		const { email, password, cpf, name } = parsedInput

		const res = await fetch(`${process.env.API_URL}/app/auth/sign-up`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email,
				password,
				cpf,
				name,
			}),
		})

		if (!res.ok) {
			throw new Error(
				'error when registering user. check the data and try again',
			)
		}

		return await res.json()
	})
