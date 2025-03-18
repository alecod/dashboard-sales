'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'

export const deleteEcommerceIntegrationFetch = actionClient
  .schema(
    z.object({
      store_cod: z.number().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { store_cod } = parsedInput

    const res = await fetch(
      `${process.env.API_URL}/app/p/ecommerce-integration/${store_cod}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (!res.ok) {
      throw new Error('failed to delete eccommerce integration')
    }
    const data = await res.json()
    return data
  })
