import { BreadcrumbFacebookMetaPixel } from '@/components/breadcrumb/facebook-meta-pixel'
import { FacebookEvents } from '@/components/cards/analytics-cards/facebook-events-card'
import { ContentLayout } from '@/components/layout/content-layout'

export default async function Page() {
  return (
    <ContentLayout>
      <BreadcrumbFacebookMetaPixel />
      <FacebookEvents />
    </ContentLayout>
  )
}
