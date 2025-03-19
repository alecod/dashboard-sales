"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "../../ui/card";

export function TicketMediumCard({
  isError,
  isLoading,
}: {
  isError: boolean;
  isLoading: boolean;
}) {
  // Dados estáticos simulados
  const totalRevenue = 150000;  // Exemplo de valor de receita total
  const totalOrders = 300;      // Exemplo de número total de pedidos

  // Cálculo do ticket médio
  const ticketMedium = totalOrders ? totalRevenue / totalOrders : 0;

  // Função para formatar o valor como moeda brasileira
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <>
      {isLoading ? (
        <Card className="flex w-60 lg:w-full select-none items-center justify-center blur-sm">
          <CardContent className="flex h-40 items-center justify-center lg:h-20">
            <span className="relative top-[0.75rem] flex flex-col items-center text-center">
              Ticket Médio: <span className="font-bold">{"N/A"}</span>
            </span>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="flex w-60 lg:w-full items-center justify-center">
          <CardContent className="flex h-40 items-center justify-center lg:h-20">
            <span className="relative top-[0.75rem] flex flex-col items-center text-center">
              Ticket Médio: <span className="font-bold">{"N/A"}</span>
            </span>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Simulação de carregamento */}
          {isLoading ? (
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