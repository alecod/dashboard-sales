'use client'
import { IntegrationDetailsSheet } from '@/components/sheet/shopify-detail-integration'
import { SheetShopify } from '@/components/sheet/shopify-integration'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import { useState } from 'react'
import { FaShopify } from 'react-icons/fa6'
import { Button } from '../../ui/button'
import { Card, CardHeader, CardTitle } from '../../ui/card'

export default function IntegrationShopifyCard() {
  const [showShopifySheet, setShowShopifySheet] = useState(false)
  const [showDetailsSheet, setShowDetailsSheet] = useState(false)
  const { ecommerceIntegration } = useEcommerceIntegrationHook()

  return (
    <div className='flex flex-col items-start justify-start'>
      <Card className='flex w-48 items-center justify-center'>
        <CardHeader className='flex items-center gap-3'>
          <FaShopify size={40} fill='#96bf48' />
          <CardTitle className='text-1xl text-center'>Shopify</CardTitle>
          {ecommerceIntegration && ecommerceIntegration.type === 'shopify' ? (
            <>
              <Button onClick={() => setShowDetailsSheet(true)}>
                Integrado
              </Button>

              <IntegrationDetailsSheet
                open={showDetailsSheet}
                onOpenChange={setShowDetailsSheet}
              />
            </>
          ) : (
            <Button onClick={() => setShowShopifySheet(true)}>Integrar</Button>
          )}
          <SheetShopify
            open={showShopifySheet}
            onOpenChange={setShowShopifySheet}
          />
        </CardHeader>
      </Card>
    </div>
  )
}
