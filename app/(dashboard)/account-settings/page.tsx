import { BreadcrumbAccount } from '@/components/breadcrumb/account'
import { ContentLayout } from '@/components/layout/content-layout'
import Form from './form'

export default function Page() {
  return (
    <ContentLayout>
      <BreadcrumbAccount />
      <Form />
    </ContentLayout>
  )
}
