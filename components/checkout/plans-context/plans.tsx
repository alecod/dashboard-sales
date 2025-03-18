'use client'
import { FaqComponent } from './faq-component'
import { PaymentCard } from './payment-card'
import { PricingTable } from './pricing-table'

export function Plans() {
  return (
    <div className='container space-y-12'>
      <PaymentCard />
      <PricingTable />
      <FaqComponent />
    </div>
  )
}
