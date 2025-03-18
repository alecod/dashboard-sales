'use client'
import { FaFacebook } from 'react-icons/fa'
import { SheetFB } from '../../sheet/facebook-integration'
import { Card, CardHeader, CardTitle } from '../../ui/card'

export function IntegrationFacebookAdsCard() {
  return (
    <div className='flex flex-col items-start justify-start'>
      <Card className='flex w-48 items-center justify-center'>
        <CardHeader className='flex items-center gap-3'>
          <FaFacebook size={40} fill='#3b5998' />
          <CardTitle className='text-1xl text-center'>Facebook Ads</CardTitle>

          <SheetFB />
        </CardHeader>
      </Card>
    </div>
  )
}
