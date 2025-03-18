'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'

export const getPlansStripeFetch = actionClient.action(
	async ({ parsedInput }) => {
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(`${process.env.API_URL}/app/plans/available`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: String(token),
			},
		})
		if (!res.ok) {
			throw new Error('Error obtaining token for password change')
		}
		const data = res.json()
		return data
	},
)
