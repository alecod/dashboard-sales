'use client'
import { SiWoo } from 'react-icons/si'
import { Button } from '../../ui/button'
import { Card, CardHeader, CardTitle } from '../../ui/card'

export function IntegrationWoocommerceCard() {
  return (
    <div className='flex flex-col items-start justify-start'>
      <Card className='flex w-48 items-center justify-center'>
        <CardHeader className='flex items-center gap-3'>
          <SiWoo size={40} fill='#96588a' />
          <CardTitle className='text-1xl text-center'>Woocomerce</CardTitle>
          <Button onClick={() => {}} disabled>
            Em breve
          </Button>
        </CardHeader>
      </Card>
    </div>
  )
}
