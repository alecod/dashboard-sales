'use client'
import LogoTicto from '@/public/images/ticto.svg'
import Image from 'next/image'
import { Button } from '../../ui/button'
import { Card, CardHeader, CardTitle } from '../../ui/card'

export function IntegrationTictoCard() {
  return (
    <div className='flex flex-col items-start justify-start'>
      <Card className='flex h-48 w-48 items-center justify-center'>
        <CardHeader className='flex items-center gap-3'>
          <Image src={LogoTicto} alt='Logo Ticto' width={100} />
          <CardTitle className='text-1xl text-center'>Ticto</CardTitle>
          <Button onClick={() => {}} disabled>
            Em breve
          </Button>
        </CardHeader>
      </Card>
    </div>
  )
}
