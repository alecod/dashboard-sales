'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'An area chart with gradient fill'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#0ea5e9',
  },
} satisfies ChartConfig

export function VisitorsChartExample() {
  return (
    <ChartContainer
      config={chartConfig}
      className='relative right-4 h-64 w-full'
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='month'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={3} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#082f49' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#7dd3fc' stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <Area
          dataKey='desktop'
          type='natural'
          fill='url(#fillDesktop)'
          fillOpacity={0.4}
          stroke='var(--color-desktop)'
          stackId='a'
        />
      </AreaChart>
    </ChartContainer>
  )
}
