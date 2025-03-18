'use client'
import LogoHotmart from '@/public/images/logo-hotmart.png'
import Image from 'next/image'
import { Button } from '../../ui/button'
import { Card, CardHeader, CardTitle } from '../../ui/card'

export function IntegrationHotmartCard() {
  return (
    <div className='flex flex-col items-start justify-start'>
      <Card className='flex w-48 items-center justify-center'>
        <CardHeader className='flex items-center gap-3'>
          <Image src={LogoHotmart} alt='Logo Hotmart' width={40} />
          <CardTitle className='text-1xl text-center'>Hotmart</CardTitle>
          <Button onClick={() => {}} disabled>
            Em breve
          </Button>
        </CardHeader>
      </Card>
    </div>
  )
}
