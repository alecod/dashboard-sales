'use client'
import AppmaxLogo from '@/public/images/logo-appmax.png'
import Image from 'next/image'
import { Button } from '../../ui/button'
import { Card, CardHeader, CardTitle } from '../../ui/card'

export function IntegrationAppmaxCard() {
  return (
    <div className='flex flex-col items-start justify-start'>
      <Card className='flex h-48 w-48 items-center justify-center'>
        <CardHeader className='flex items-center gap-3'>
          <Image src={AppmaxLogo} alt='Appmax logo' width={1000} />
          <CardTitle className='text-1xl text-center'>Appmax</CardTitle>
          <Button onClick={() => {}} disabled>
            Em breve
          </Button>
        </CardHeader>
      </Card>
    </div>
  )
}
