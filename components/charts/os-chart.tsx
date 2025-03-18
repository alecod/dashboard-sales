'use client'

import * as React from 'react'
import { Cell, Label, Pie, PieChart } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A donut chart with text'

const chartConfig = {
  value: {
    label: 'value',
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

type OsChartProps = {
  data: [{ name: string; visitors: number }]
}

const pieColors = ['#3357FF', '#F4D03F', '#AF7AC5', '#e57373']

export function OsChart({ data }: OsChartProps) {
  const transformedData = data?.map((item) => ({
    ...item,
    visitantes: item.visitors,
  }))

  const totalvalue = React.useMemo(() => {
    return transformedData.reduce((acc, curr) => acc + curr.visitantes, 0)
  }, [transformedData])

  return (
    <div className='grid grid-cols-2'>
      <div>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[290px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={transformedData}
              dataKey='visitantes'
              nameKey='name'
              innerRadius={60}
              strokeOpacity={0}
              strokeWidth={2}
            >
              {transformedData.map((entry, index) => (
                <Cell
                  key={`cell-${String(index)}`}
                  fill={pieColors[index % pieColors.length]}
                />
              ))}

              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-2xl font-bold'
                        >
                          {totalvalue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>

      <div className='ml-4 flex flex-col justify-center'>
        <table className='table-auto'>
          <thead>
            <tr>
              <th className='px-4 py-2 text-left text-sm'>Nome</th>
              <th className='px-4 py-2 text-left text-sm'>Acessos</th>
            </tr>
          </thead>
          <tbody>
            {transformedData.map((item, index) => (
              <tr key={item.name}>
                <td className='flex items-center px-4 py-2'>
                  {/* Quadrado com a cor correspondente */}
                  <div
                    className='mr-2 h-3 w-3'
                    style={{
                      backgroundColor: pieColors[index % pieColors.length],
                    }}
                  />
                  <span className='text-sm'> {item.name}</span>
                </td>
                <td className='px-4 py-2'>
                  <span className='text-sm'>{item.visitantes}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
