'use server'

import { actionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'

export const getRefreshTokenFetch = actionClient.action(async () => {
  const ck = cookies()
  const rt = ck.get('k_r_t')?.value
  if (process.env.API_URL && rt) {
    const res = await fetch(`${process.env.API_URL}/app/auth?token=${rt}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) {
      throw new Error('Error obtaining access and refresh token')
    }
    const data = res.json()
    return data
  }
})
