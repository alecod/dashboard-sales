"use client";
import { DashboardFilter } from "@/components/filters/dashboard-filter";
import { ContentLayout } from "@/components/layout/content-layout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { MarketingCoastCard } from "@/components/cards/dashboard-cards/marketing-coast-card";
import { ProductCoastCard } from "@/components/cards/dashboard-cards/product-coast-card";
import { TaxesCard } from "@/components/cards/dashboard-cards/taxes-card";
import { TotalProfitCard } from "@/components/cards/dashboard-cards/total-profit-card";
import { TotalRevenueCard } from "@/components/cards/dashboard-cards/total-revenue-card";

import { OrdersNumberCard } from "@/components/cards/dashboard-cards/orders-number-card";
import { ProfitMarginCard } from "@/components/cards/dashboard-cards/profit-margin-card";
import { TicketMediumCard } from "@/components/cards/dashboard-cards/ticket-medium-card";
import { DashboardChart } from "@/components/charts/dashboard-chart";
import { ProfitRankingTable } from "@/components/tables/profit-ranking";

import { getShopifyDashboardDataFetch } from "@/actions/shopify/get-shopify-dashboard-data";
import { ENV } from "@/env/env-store";
import { useFilterDashboardHook } from "@/hooks/dashboard-filter-hook";
import { useDashboardHook } from "@/hooks/dashboard-hook";
import { useEcommerceIntegrationHook } from "@/hooks/ecommerce-integration-hook";
import type { ShopifyOrdersData } from "@/hooks/orders-shopify-hook";
import { useStoreHook } from "@/hooks/store-hook";

export function Dashboard({ data }: { data?: ShopifyOrdersData }) {
  const {
    shopifyDashboardData: dashboardData,
    setShopifyDashboardData,
    setIsLoadingShopifyDashboardData,
    toggleIncludeProductCosts,
    toggleIncludeFacebookCampaignCosts,
    toggleIncludeCheckoutCosts,
    toggleIncludePaymentGatewayCosts,
    toggleIncludeTaxes,
    setDashboardTotals,
    setDashboardTaxes,
    includeCheckoutCosts,
    includePaymentGatewayCosts,
    includeTaxes,
    includeProductCosts,
    includeFacebookCampaignCosts,
    includePaidOrders,
    includePendingOrders,
    includeCancelledOrders,
    includeRefundedOrders,
    toggleIncludePaidOrders,
    toggleIncludePendingOrders,
    toggleIncludeCancelledOrders,
    toggleIncludeRefundedOrders,
  } = useDashboardHook();

  const { selectedStore } = useStoreHook();
  const { ecommerceIntegration } = useEcommerceIntegrationHook();
  const { dateRange, status } = useFilterDashboardHook();

  const queryClient = useQueryClient();
  const { API_URL } = ENV();

  const {
    data: shopifyDashboardData,
    isError,
    error,
    isPending,
  } = useQuery({
    enabled: !!selectedStore && !!ecommerceIntegration && !!API_URL,
    initialData: null,
    queryKey: [
      "shopify-dashboard-data",
      ecommerceIntegration,
      dateRange,
      status,
      selectedStore,
    ],
    queryFn: async () => {
      const res = await getShopifyDashboardDataFetch({
        store_cod: selectedStore?.store_cod as number,
        startDate: dateRange?.from?.toISOString() || "",
        endDate: dateRange?.to?.toISOString() || "",
        status,
      });
      if (res?.serverError) {
        throw new Error("Error");
      }
      return res?.data;
    },

    retry: 0,
    refetchOnWindowFocus: false,
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0;
      }
      return Number.POSITIVE_INFINITY;
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isError) {
      queryClient.setQueryDefaults(
        [
          "shopify-dashboard-data",
          ecommerceIntegration,
          dateRange,
          status,
          selectedStore,
        ],
        { staleTime: Number.POSITIVE_INFINITY }
      );
    }
  }, [isError]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsLoadingShopifyDashboardData(true);

    if (shopifyDashboardData && shopifyDashboardData) {
      setShopifyDashboardData(shopifyDashboardData);
      setIsLoadingShopifyDashboardData(false);

      if (!includeProductCosts) toggleIncludeProductCosts();
      if (!includeFacebookCampaignCosts) toggleIncludeFacebookCampaignCosts();
      if (!includeCheckoutCosts) toggleIncludeCheckoutCosts();
      if (!includePaymentGatewayCosts) toggleIncludePaymentGatewayCosts();
      if (!includeTaxes) toggleIncludeTaxes();

      if (!includePaidOrders) toggleIncludePaidOrders();
      if (!includePendingOrders) toggleIncludePendingOrders();
      if (!includeCancelledOrders) toggleIncludeCancelledOrders();
      if (!includeRefundedOrders) toggleIncludeRefundedOrders();

      setDashboardTotals({
        totalRevenue:
          Number.parseFloat(shopifyDashboardData.invoicing.paid) +
          Number.parseFloat(shopifyDashboardData.invoicing.cancelled) +
          Number.parseFloat(shopifyDashboardData.invoicing.refunded) +
          Number.parseFloat(shopifyDashboardData.invoicing.pending),
        totalPorfit: Number.parseFloat(shopifyDashboardData.invoicing.paid),
        totalCancelledOrders: Number.parseFloat(
          shopifyDashboardData.invoicing.cancelled
        ),
        totalPaidOrders: Number.parseFloat(shopifyDashboardData.invoicing.paid),
        totalPendingOrders: Number.parseFloat(
          shopifyDashboardData.invoicing.pending
        ),
        totalRefundedOrders: Number.parseFloat(
          shopifyDashboardData.invoicing.refunded
        ),
        totalProductCost: Number.parseFloat(
          shopifyDashboardData.taxes.product_cost
        ),
        totalProductRelatedCosts:
          Number.parseFloat(shopifyDashboardData.taxes.product_cost) +
          Number.parseFloat("0"),
        totalFacebookCampaignCost: Number.parseFloat(
          shopifyDashboardData.marketing.facebook_ads
        ),
        totalAdCosts: Number.parseFloat(
          shopifyDashboardData.marketing.facebook_ads
        ),
      });
      setDashboardTaxes(shopifyDashboardData.taxes);
    } else {
      if (!includeFacebookCampaignCosts) toggleIncludeFacebookCampaignCosts();
      if (!includeProductCosts) toggleIncludeProductCosts();
      if (!includeTaxes) toggleIncludeTaxes();
      if (!includePaymentGatewayCosts) toggleIncludePaymentGatewayCosts();
      if (!includeCheckoutCosts) toggleIncludeCheckoutCosts();

      if (!includePaidOrders) toggleIncludePaidOrders();
      if (!includePendingOrders) toggleIncludePendingOrders();
      if (!includeCancelledOrders) toggleIncludeCancelledOrders();
      if (!includeRefundedOrders) toggleIncludeRefundedOrders();

      setDashboardTotals({
        totalRevenue: 0.0,
        totalPorfit: 0.0,
        totalCancelledOrders: 0.0,
        totalPaidOrders: 0.0,
        totalPendingOrders: 0.0,
        totalRefundedOrders: 0.0,
        totalProductCost: 0.0,
        totalProductRelatedCosts: 0.0,
        totalFacebookCampaignCost: 0.0,
        totalAdCosts: 0.0,
      });
      setDashboardTaxes({
        checkout: "0.0",
        gateway: "0.0",
        product_cost: "0.0",
        product_cost_and_ads: { amount_fixed: "0.0", amount_percentage: "0.0" },
        profit: { amount_fixed: "0.0", amount_percentage: "0.0" },
        invoicing: "0.0",
      });
    }
  }, [shopifyDashboardData, isError, error]);

  return (
    <ContentLayout>
      <div className="flex flex-col gap-3">
        <div className="flex w-full flex-col gap-3 lg:mt-3 lg:flex-row lg:space-x-5">
          <DashboardFilter />
        </div>
        <div className="flex w-full flex-row gap-4 overflow-x-auto md:flex-wrap lg:flex-nowrap xxl:overflow-hidden pb-2 lg:pb-0">
          <TotalRevenueCard />
          <TaxesCard isError={isError} isLoading={isPending} />
          <ProductCoastCard isError={isError} isLoading={isPending} />
          <MarketingCoastCard isError={isError} isLoading={isPending} />
        </div>
        <div className="flex w-full flex-col-reverse gap-4 lg:flex-row">
          <div className="w-full lg:w-[485px]">
            <TotalProfitCard isError={isError} isLoading={isPending} />
          </div>
          <DashboardChart isError={isError} isLoading={isPending} />
        </div>
        <div className="flex flex-row gap-2 overflow-x-auto lg:overflow-hidden pb-2 lg:pb-0 w-full max-w-full">
          <TicketMediumCard isError={isError} isLoading={isPending} />
          <OrdersNumberCard isError={isError} isLoading={isPending} />
          <ProfitMarginCard isError={isError} isLoading={isPending} />
        </div>
        <div className="flex flex-col">
          <h2 className="mt-3 lg:mt-10 text-[1.2rem] font-bold">
            Produtos com maior Lucro Liquido
          </h2>
          <ProfitRankingTable isError={isError} isLoading={isPending} />
        </div>
      </div>
    </ContentLayout>
  );
}
