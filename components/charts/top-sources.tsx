import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts'

const chartConfig = {
  value: {
    label: 'value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

const chartData = [
  { topsource: 'Direto', value: 500, fill: '#38bdf8' },
  { topsource: 'Google', value: 450, fill: '#0ea5e9' },
  { topsource: 'Github', value: 400, fill: '#0284c7' },
  { topsource: 'Bing', value: 350, fill: '#0369a1' },
  { topsource: 'ChatGPT', value: 300, fill: '#075985' },
  { topsource: 'Outros', value: 250, fill: '#0c4a6e' },
]

type TopSourcesChartProps = {
  data: [{ name: string; visitors: number }]
}

const barColors = ['#0c4a6e', '#075985', '#0369a1', '#0284c7', '#0ea5e9']

export function TopSourceChart({ data }: TopSourcesChartProps) {
  const transformedData = data?.map((item) => ({
    ...item,
    visitantes: item.visitors,
  }))
  return (
    <>
      <header className='mb-3 flex w-full justify-between'>
        <span className='text-xs text-muted-foreground'>Origem</span>
      </header>
      <div className='flex'>
        <div className='w-86'>
          <ChartContainer config={chartConfig} className='w-96'>
            <BarChart
              accessibilityLayer
              data={transformedData}
              layout='vertical'
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey='name'
                type='category'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey='visitantes' type='number' hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey='visitantes'
                layout='vertical'
                radius={4}
                barSize={30}
              >
                {transformedData?.map((entry, index) => (
                  <Cell
                    key={`cell-${String(index)}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
                <LabelList
                  dataKey='visitantes'
                  position='right'
                  offset={8}
                  className='fill-foreground'
                  fontSize={12}
                />
                <LabelList
                  dataKey='name'
                  position='insideLeft'
                  offset={8}
                  className='fill-[#fff]'
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
