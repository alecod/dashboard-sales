'use client'
import { PiMagnifyingGlass } from 'react-icons/pi'
import { Input } from '../ui/input'

export function SearchBar() {
  return (
    <div className='relative'>
      <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
        <PiMagnifyingGlass className='text-gray-500 h-5 w-5' />
      </span>
      <Input placeholder='Buscar...' className='w-80 pl-10' />
    </div>
  )
}
