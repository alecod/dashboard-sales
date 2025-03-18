'use client'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from 'recharts'

const chartConfig = {
  value: {
    label: 'value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

type DevicesChartProps = {
  data: [{ name: string; visitors: number }]
}

const barColors = ['#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59']

export function DevicesChart({ data }: DevicesChartProps) {
  const transformedData = data?.map((item) => ({
    ...item,
    visitantes: item.visitors,
  }))

  return (
    <>
      <div className='mt-5 flex'>
        <div className='w-full'>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={transformedData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='visitantes'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey='visitantes' radius={8} barSize={35}>
                {transformedData?.map((entry, index) => (
                  <Cell
                    key={`cell-${String(index)}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
                <LabelList
                  dataKey='name'
                  position='top'
                  offset={12}
                  className='fill-foreground'
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </>
  )
}
