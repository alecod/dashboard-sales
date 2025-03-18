'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'

export const getRecoveryTokenFetch = actionClient
  .schema(
    z.object({
      token: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { token } = parsedInput
    if (process.env.API_URL && token) {
      const res = await fetch(
        `${process.env.API_URL}/app/auth/verify-forgot?token=${token}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      if (!res.ok) {
        throw new Error('Error obtaining token for password change')
      }
      return await res.json()
    }
  })
