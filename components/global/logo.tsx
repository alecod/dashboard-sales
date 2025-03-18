'use client'
import LogoDark from '@/public/images/logo-dark.png'
import LogoLight from '@/public/images/logo-light.png'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function LogoGlobal() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
    setMounted(true)
  }, [setTheme])

  useEffect(() => {
    if (theme) {
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  if (!mounted) return null

  return (
    <div className='pl-5 pt-2'>
  
    </div>
  )
}
