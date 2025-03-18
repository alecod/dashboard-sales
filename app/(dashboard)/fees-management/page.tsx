import { BreadcrumbCoast } from '@/components/breadcrumb/coast'
import { ContentLayout } from '@/components/layout/content-layout'
import { CoastManagementTable } from './table'

export default function WelcomePage() {
  return (
    <ContentLayout>
      <BreadcrumbCoast />
      <CoastManagementTable />
    </ContentLayout>
  )
}
