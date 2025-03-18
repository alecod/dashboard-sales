'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A bar chart with a custom label'

const chartData = [
  { browser: 'Google Chrome', value: 186, fill: '#2dd4bf' },
  { browser: 'Firefox', value: 305, fill: '#14b8a6' },
  { browser: 'Safari', value: 237, fill: '#0d9488' },
  { browser: 'Microsoft Edge', value: 73, fill: '#0f766e' },
  { browser: 'Opera', value: 209, fill: '#115e59' },
  { browser: 'Sansumg Browser', value: 214, fill: '#134e4a' },
  { browser: 'Outros', value: 214, fill: '#134e4a' },
]

const chartConfig = {
  value: {
    label: 'value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function DevicesChartExample() {
  return (
    <>
      <div className='mt-5 flex'>
        <div className='w-full'>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='value'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                // tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey='value'
                fill='var(--color-value)'
                radius={8}
                barSize={35}
              >
                <LabelList
                  dataKey='browser'
                  position='top'
                  offset={12}
                  className='fill-foreground'
                  fontSize={12}
                />
                {/* <LabelList
                  dataKey='browser'
                  position='insideBottom'
                  offset={8}
                  className='fill-[#fff]'
                  fontSize={10}
                /> */}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </>
  )
}
