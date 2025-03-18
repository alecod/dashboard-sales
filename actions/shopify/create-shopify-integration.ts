'use server'

import { actionClient } from '@/lib/safe-action'
import { isValid } from 'date-fns'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const createShopifyIntegrationFetch = actionClient
	.schema(
		z.object({
			domain: z.string().min(1, { message: 'Este campo é obrigatório' }),
			fees: z.array(
				z
					.object({
						name: z.string().min(3, 'O nome deve conter pelo menos 3 letras'),
						amount_fixed: z.coerce.number().nonnegative(),
						amount_percentage: z.coerce.number().nonnegative(),
						type: z.string(),
						target: z
							.enum([
								'product_cost',
								'invoicing',
								'profit',
								'product_cost_and_ads',
							])
							.optional()
							.nullable(),
						start_at: z.string().refine(event => isValid(new Date(event)), {
							message: 'A data de inicio é obrigatoria',
						}),
						end_at: z.string().optional(),
					})
					.superRefine((data, ctx) => {
						if (data.amount_fixed === 0 && data.amount_percentage === 0) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: 'Deve haver pelo menos um valor fixo ou percentual',
								path: ['amount_percentage'],
							})
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: 'Deve haver pelo menos um valor fixo ou percentual',
								path: ['amount_fixed'],
							})
						}
						if (!['checkout', 'gateway'].includes(data.type)) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: 'Selecione um tipo válido',
								path: ['type'],
							})
						}
					}),
			),
			store_cod: z.number().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { domain, fees, store_cod } = parsedInput
		const ck = cookies()
		const token = ck.get('k_a_t')?.value
		const res = await fetch(
			`${process.env.API_URL}/app/p/shopify/integration`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: String(token),
				},
				body: JSON.stringify({
					integration: {
						store_cod,
						type: 'shopify',
						domain,
					},
					fees,
				}),
			},
		)

		if (!res.ok) {
			throw new Error('Failed to create Shopify integration')
		}

		return await res.json()
	})
