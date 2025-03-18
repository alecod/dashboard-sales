'use client'
import { AiFillTikTok } from 'react-icons/ai'
import { Button } from '../../ui/button'
import { Card, CardHeader, CardTitle } from '../../ui/card'

export function IntegrationTikTokAdsCard() {
  return (
    <div className='flex flex-col items-start justify-start'>
      <Card className='flex w-48 items-center justify-center'>
        <CardHeader className='flex items-center gap-3'>
          <AiFillTikTok size={40} />
          <CardTitle className='text-1xl text-center'>TikTok Ads</CardTitle>
          <Button onClick={() => {}} disabled>
            Em breve
          </Button>
        </CardHeader>
      </Card>
    </div>
  )
}
