'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import type { ReactNode } from 'react'

export function ProgressBarLoading({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ProgressBar
        height='3px'
        color='#19dbfe'
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  )
}
