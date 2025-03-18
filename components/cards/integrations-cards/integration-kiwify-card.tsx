'use client'
import LogoKiwify from '@/public/images/logo-kiwify.webp'
import Image from 'next/image'
import { Button } from '../../ui/button'
import { Card, CardHeader, CardTitle } from '../../ui/card'

export function IntegrationKiwifyCard() {
  return (
    <div className='flex flex-col items-start justify-start'>
      <Card className='flex h-48 w-48 items-center justify-center'>
        <CardHeader className='flex items-center gap-3'>
          <Image src={LogoKiwify} alt='Logo Kiwify' className='size-7 w-full' />
          <CardTitle className='text-1xl text-center'>Kiwify</CardTitle>
          <Button onClick={() => {}} disabled>
            Em breve
          </Button>
        </CardHeader>
      </Card>
    </div>
  )
}
