'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '../../ui/card'

export function ProfitMarginCard({
  isError,
  isLoading,
}: {
  isError: boolean
  isLoading: boolean
}) {
  // Dados estáticos simulados
  const totalRevenue = 50000;  // Exemplo de receita total
  const totalProfit = 12000;   // Exemplo de lucro total

  // Cálculo da margem de lucro
  const profitMargin =
    totalRevenue && totalProfit ? (totalProfit / totalRevenue) * 100 : 0

  // Função para formatar a margem de lucro com duas casas decimais
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <>
      {isLoading ? (
        <Card className="flex w-60 select-none items-center justify-center blur-sm lg:w-full">
          <CardContent className="flex h-40 items-center justify-center lg:h-20">
            <span className="relative top-3 flex flex-col items-center text-center">
              Margem de Lucro: <span className="font-bold">N/A</span>
            </span>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="flex w-60 items-center justify-center lg:w-full">
          <CardContent className="flex h-40 items-center justify-center lg:h-20">
            <span className="relative top-3 flex flex-col items-center text-center">
              Margem de Lucro: <span className="font-bold">N/A</span>
            </span>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Simulação de carregamento */}
          {isLoading ? (
            <Card className="flex h-20 w-60 items-center justify-center lg:w-full">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-24" />
            </Card>
          ) : (
            <Card className="flex w-60 items-center justify-center lg:w-full">
              <CardContent className="flex h-40 items-center justify-center lg:h-20">
                <span className="relative top-3 flex flex-col items-center text-center">
                  Margem de Lucro:{' '}
                  <span className="font-bold">
                    {totalRevenue && totalProfit
                      ? formatPercentage(profitMargin)
                      : 'N/A'}
                  </span>
                </span>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  )
}