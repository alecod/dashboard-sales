'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '../../ui/card'

export function RoiCard({
  isError,
  isLoading,
}: {
  isError: boolean
  isLoading: boolean
}) {
  // Dados estáticos simulados
  const totalRevenue = 50000;  // Exemplo de receita total
  const totalInvestment = 10000;  // Exemplo de investimento total

  // Cálculo do ROI
  const roi = totalRevenue && totalInvestment ? ((totalRevenue - totalInvestment) / totalInvestment) * 100 : 0

  // Função para formatar o ROI com duas casas decimais
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <>
      {isLoading ? (
        <Card className="flex w-full select-none items-center justify-center blur-sm">
          <CardContent className="flex h-40 items-center justify-center lg:h-20">
            <span className="relative top-3 flex flex-col items-center justify-center text-center">
              ROI: <span className="font-bold">N/A</span>
            </span>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="flex w-full items-center justify-center">
          <CardContent className="flex h-40 items-center justify-center lg:h-20">
            <span className="relative top-3 flex flex-col items-center justify-center text-center">
              ROI: <span className="font-bold">N/A</span>
            </span>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Simulação de carregamento */}
          {isLoading ? (
            <Card className="flex h-20 w-full items-center justify-center">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-24" />
            </Card>
          ) : (
            <Card className="flex w-full items-center justify-center">
              <CardContent className="flex h-40 items-center justify-center lg:h-20">
                <span className="relative top-3 flex flex-col items-center justify-center text-center">
                  ROI: <span className="font-bold">{formatPercentage(roi)}</span>
                </span>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  )
}