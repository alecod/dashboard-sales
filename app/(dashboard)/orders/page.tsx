import { ContentLayout } from '@/components/layout/content-layout'
import { BreadcrumbEcommerceOrders } from '@/components/breadcrumb/orders'
import { OrdersTable } from '@/components/tables/orders-table'

export default function Page() {
  return (
    <ContentLayout>
      <BreadcrumbEcommerceOrders />
      <OrdersTable />
    </ContentLayout>
  )
}
