import { ContentLayout } from '@/components/layout/content-layout'
import { BreadcrumbEcommerceOrders } from '@/components/breadcrumb/orders'
import OrderDetails from '@/components/orders'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <ContentLayout>
      <BreadcrumbEcommerceOrders />
      <OrderDetails orderId={params.id} />
    </ContentLayout>
  )
}
