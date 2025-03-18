import { BreadcrumbIntegrations } from '@/components/breadcrumb/integrations'
import { IntegrationCartpandaCard } from '@/components/cards/integrations-cards/integration-cartpanda-card'
import { IntegrationFacebookAdsCard } from '@/components/cards/integrations-cards/integration-facebookads-card'
import { IntegrationGoogleAdsCard } from '@/components/cards/integrations-cards/integration-googleads-card'
import { IntegrationHotmartCard } from '@/components/cards/integrations-cards/integration-hotmart-card'
import { IntegrationKiwifyCard } from '@/components/cards/integrations-cards/integration-kiwify-card'
import { IntegrationNuvemshopCard } from '@/components/cards/integrations-cards/integration-numvemshop-card'
import IntegrationShopifyCard from '@/components/cards/integrations-cards/integration-shopify-card'
import { IntegrationTictoCard } from '@/components/cards/integrations-cards/integration-ticto-card'
import { IntegrationTikTokAdsCard } from '@/components/cards/integrations-cards/integration-tiktok-card'
import { IntegrationWoocommerceCard } from '@/components/cards/integrations-cards/integration-woocommerce-card'
import { IntegrationYampiCard } from '@/components/cards/integrations-cards/integration-yampi-card'
import { ContentLayout } from '@/components/layout/content-layout'

export default function Page() {
  return (
    <ContentLayout>
      <BreadcrumbIntegrations />
      <div className='mt-5 flex flex-col gap-5'>
        <div className='flex flex-col space-y-5'>
          <h2 className='text-xl font-semibold'>Plataformas</h2>
          <div className='flex flex-row items-start gap-5 overflow-x-auto lg:flex-wrap lg:overflow-hidden'>
            <IntegrationShopifyCard />
            <IntegrationHotmartCard />
            <IntegrationKiwifyCard />
            <IntegrationTictoCard />
            <IntegrationWoocommerceCard />
            <IntegrationCartpandaCard />
            <IntegrationNuvemshopCard />
          </div>
        </div>
        <div className='flex flex-col space-y-5'>
          <h2 className='text-xl font-semibold'>Canais</h2>
          <div className='flex flex-row gap-5 overflow-x-auto'>
            <IntegrationFacebookAdsCard />
            <IntegrationGoogleAdsCard />
            <IntegrationTikTokAdsCard />
          </div>
        </div>
        <div className='flex flex-col space-y-5'>
          <h2 className='text-xl font-semibold'>Checkout</h2>
          <div className='flex flex-row gap-5 overflow-x-auto'>
            <IntegrationYampiCard />
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}
