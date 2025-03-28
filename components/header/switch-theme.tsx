'use client'
import * as React from 'react'
import { PiMoon, PiSun } from 'react-icons/pi'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function SwitchTheme() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button variant='outline' size='icon' onClick={toggleTheme}>
      {theme === 'light' ? (
        <PiSun className='h-[1.2rem] w-[1.2rem]' />
      ) : (
        <PiMoon className='h-[1.2rem] w-[1.2rem]' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
