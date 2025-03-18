"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardHook } from "@/hooks/dashboard-hook";
import { useEcommerceIntegrationHook } from "@/hooks/ecommerce-integration-hook";
import { Card, CardContent } from "../../ui/card";

export function TicketMediumCard({
  isError,
  isLoading,
}: {
  isError: boolean;
  isLoading: boolean;
}) {
  const { shopifyDashboardData, isLoadingShopifyDashboardData, totalRevenue } =
    useDashboardHook();
  const { ecommerceIntegration } = useEcommerceIntegrationHook();

  // Cálculo do ticket médio
  const ticketMedium = shopifyDashboardData?.total_orders
    ? totalRevenue / shopifyDashboardData?.total_orders
    : 0;

  // Função para formatar o valor como moeda brasileira
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <>
      {!ecommerceIntegration || isLoading ? (
        <Card className="flex w-60 lg:w-full select-none items-center justify-center blur-sm">
          <CardContent className="flex h-40 items-center justify-center lg:h-20">
            <span className="relative top-[0.75rem] flex flex-col items-center text-center">
              Ticket Médio: <span className="font-bold">{"N/A"}</span>
            </span>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="flex  w-60 lg:w-full items-center justify-center">
          <CardContent className="flex h-40 items-center justify-center lg:h-20">
            <span className="relative top-[0.75rem] flex flex-col items-center text-center">
              Ticket Médio: <span className="font-bold">{"N/A"}</span>
            </span>
          </CardContent>
        </Card>
      ) : (
        <>
          {isLoadingShopifyDashboardData ? (
            <Card className="flex h-20 w-60 lg:w-full items-center justify-center">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-24" />
            </Card>
          ) : (
            <Card className="flex w-60 lg:w-full items-center justify-center">
              <CardContent className="flex h-40 items-center justify-center lg:h-20">
                <span className="relative top-[0.75rem] flex flex-col items-center text-center">
                  Ticket Médio:{" "}
                  <span className="font-bold">
                    {ticketMedium ? formatCurrency(ticketMedium) : "N/A"}
                  </span>
                </span>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
}
