import dynamic from 'next/dynamic'

const CheckoutReturnComponent = dynamic(
  () => import('@/components/checkout/return'),
  {
    ssr: false,
  },
)

export default function CheckoutPage() {
  return <CheckoutReturnComponent />
}
