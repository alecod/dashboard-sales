'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '../../ui/card'

export function OrdersNumberCard({
  isError,
  isLoading,
}: {
  isError: boolean
  isLoading: boolean
}) {
  // Dados estáticos simulados
  const totalOrders = 150;  // Exemplo de número de pedidos

  return (
    <>
      {isLoading ? (
        <Card className="flex w-60 lg:w-full select-none items-center justify-center blur-sm">
          <CardContent className="flex h-40 items-center justify-center lg:h-20">
            <span className="relative top-3 flex flex-col items-center text-center">
              Número de pedidos: <span className="font-bold">N/A</span>
            </span>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="flex w-60 lg:w-full items-center justify-center">
          <CardContent className="flex h-40 items-center justify-center lg:h-20">
            <span className="relative top-3 flex flex-col items-center text-center">
              Número de pedidos: <span className="font-bold">N/A</span>
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
                <span className="relative top-3 flex flex-col items-center text-center text-sm">
                  Número de pedidos:{" "}
                  <span className="font-bold">{totalOrders}</span>
                </span>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  )
}
