import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

export const description = 'A bar chart with a custom label'

const chartData = [
  { topsource: 'Direto', value: 500, fill: '#38bdf8' },
  { topsource: 'Google', value: 450, fill: '#0ea5e9' },
  { topsource: 'Github', value: 400, fill: '#0284c7' },
  { topsource: 'Bing', value: 350, fill: '#0369a1' },
  { topsource: 'ChatGPT', value: 300, fill: '#075985' },
  { topsource: 'Outros', value: 250, fill: '#0c4a6e' },
]

const chartConfig = {
  value: {
    label: 'Total',
    color: '#fff',
  },
  label: {
    color: '#fff',
  },
} satisfies ChartConfig

export function TopSourceChartExample() {
  return (
    <>
      <header className='mb-3 flex w-full justify-between'>
        <span className='text-xs text-muted-foreground'>Origem </span>
      </header>
      <div className='flex'>
        <div className='w-86'>
          <ChartContainer config={chartConfig} className='w-96'>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout='vertical'
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey='topsource'
                type='category'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey='value' type='number' hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='line' />}
              />
              <Bar dataKey='value' layout='vertical' radius={4}>
                <LabelList
                  dataKey='value'
                  position='right'
                  offset={8}
                  className='fill-foreground'
                  fontSize={12}
                />
                <LabelList
                  dataKey='topsource'
                  position='insideLeft'
                  offset={8}
                  className='fill-[--color-label]'
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
