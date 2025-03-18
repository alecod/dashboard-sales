
import Image from 'next/image'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-dvh'>
      <div className='xs:items-start xs:justify-start flex w-full flex-col lg:w-1/2 lg:items-center lg:justify-center'>
        {children}
      </div>
      <div className='hidden w-1/2 flex-col items-center justify-center bg-k-white dark:bg-k-greenDark lg:flex'>
      
      </div>
    </div>
  )
}
