'use server'

import { actionClient } from '@/lib/safe-action'
import { isValid } from 'date-fns'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const updateFeeFetch = actionClient
	.schema(
		z
			.object({
				fee_cod: z.number(),
				name: z
					.string()
					.min(3, { message: 'O nome deve conter pelo menos 3 letras' }),
				amount_fixed: z.coerce
					.number()
					.min(1, 'Insira um valor')
					.nonnegative({ message: 'Informe um valor fixo válido' }),
				amount_percentage: z.coerce
					.number()
					.min(1, 'Insira o valor')
					.nonnegative({ message: 'Informe um valor percentual válido' }),
				type: z.string().min(1, { message: 'Selecione uma das opções' }),
				target: z.string().min(1, { message: 'Selecione uma das opções' }),
				start_at: z.string().refine(date => isValid(new Date(date)), {
					message: 'A data de início é obrigatória',
				}),
				end_at: z.string().optional(),
			})
			.refine(
				data => {
					if (data.amount_fixed === 0 && data.amount_percentage === 0) {
						return false
					}
					return true
				},
				{
					message: 'Deve haver pelo menos um valor fixo ou percentual',
					path: ['amount_fixed', 'amount_percentage'],
				},
			),
	)
	.action(async ({ parsedInput }) => {
		const {
			amount_fixed,
			amount_percentage,
			name,
			start_at,
			target,
			type,
			end_at,
			fee_cod,
		} = parsedInput

		console.log(parsedInput)

		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(`${process.env.API_URL}/app/p/fee/${fee_cod}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: String(token),
			},
			body: JSON.stringify({
				amount_fixed,
				amount_percentage,
				name,
				start_at,
				target,
				type,
				end_at,
			}),
		})

		const data = await res.json()
		console.log(data)

		if (!res.ok) {
			throw new Error('Error updating fees and taxes')
		}

		return data
	})
