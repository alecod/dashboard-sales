'use client'
import { routes } from '@/routes/routes'
import Image from 'next/image'
import Link from 'next/link'

export function Header({ title }: { title: string }) {
  return (
    <div className='flex flex-col'>
      <Link href={routes.auth.signin}>
  
      </Link>
      <h1 className='mt-5 text-2xl font-bold'>{title}</h1>
    </div>
  )
}
