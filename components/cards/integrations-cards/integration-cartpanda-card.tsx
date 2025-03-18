'use client'
import CartPandaLogo from '@/public/images/cartpanda.svg'
import Image from 'next/image'
import { Button } from '../../ui/button'
import { Card, CardHeader, CardTitle } from '../../ui/card'

export function IntegrationCartpandaCard() {
  return (
    <div className='flex flex-col items-start justify-start'>
      <Card className='flex w-48 items-center justify-center'>
        <CardHeader className='flex items-center gap-3'>
          <Image src={CartPandaLogo} alt='Cart logo' width={35} />
          <CardTitle className='text-1xl text-center'>Cartpanda</CardTitle>
          <Button onClick={() => {}} disabled>
            Em breve
          </Button>
        </CardHeader>
      </Card>
    </div>
  )
}
