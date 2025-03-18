import { BreadcrumbAnalytics } from '@/components/breadcrumb/analytics'
import { DevicesCard } from '@/components/cards/analytics-cards/devices-card'
import { LocationCard } from '@/components/cards/analytics-cards/location-card'
import { TopPagesCard } from '@/components/cards/analytics-cards/top-pages'
import { TopSourcesCard } from '@/components/cards/analytics-cards/top-sources'
import { UtmsCard } from '@/components/cards/analytics-cards/utms-card'
import { VisitorsCard } from '@/components/cards/analytics-cards/visitors-card'
import { FilterAnalytics } from '@/components/filters/analytics-filter'

export default function Page() {
  return (
    <div className='container'>
      <BreadcrumbAnalytics />

      <div className=''>
        <FilterAnalytics />
      </div>

      <div className='mt-3 flex w-full flex-row-reverse items-center gap-3 overflow-x-auto overflow-y-hidden pb-2 lg:flex-row lg:pb-0'>
        <DevicesCard />
        <VisitorsCard />
      </div>
      <div className='mt-3 flex w-full flex-row-reverse items-center gap-3 overflow-x-auto overflow-y-hidden pb-2 lg:flex-row lg:pb-0'>
        <TopSourcesCard />
        <LocationCard />
      </div>
      <div className='mt-3 flex w-full flex-row-reverse items-center gap-3 overflow-x-auto overflow-y-hidden pb-2 lg:flex-row lg:pb-0'>
        <UtmsCard />
        <TopPagesCard />
      </div>
    </div>
  )
}
