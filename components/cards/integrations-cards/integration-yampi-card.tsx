'use client'
import YampiLogo from '@/public/images/yampi.svg'
import Image from 'next/image'
import { Button } from '../../ui/button'
import { Card, CardHeader, CardTitle } from '../../ui/card'

export function IntegrationYampiCard() {
  return (
    <div className='flex flex-col items-start justify-start'>
      <Card className='flex w-48 items-center justify-center'>
        <CardHeader className='flex items-center gap-3'>
          <Image src={YampiLogo} alt='yampi logo' />
          <CardTitle className='text-1xl text-center'>Yampi</CardTitle>
          <Button onClick={() => {}} disabled>
            Em breve
          </Button>
        </CardHeader>
      </Card>
    </div>
  )
}
