import { BreadcrumbFacebookAds } from '@/components/breadcrumb/facebook'
import { ContentLayout } from '@/components/layout/content-layout'
import { FacebookAdsTable } from '@/components/tables/facebook-ads-table'

export default async function Page() {
  return (
    <ContentLayout>
      <BreadcrumbFacebookAds />
      <FacebookAdsTable />
    </ContentLayout>
  )
}
