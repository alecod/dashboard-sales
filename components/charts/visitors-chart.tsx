'use client'

import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { format } from 'date-fns'
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

type VisitorsChartProps = {
  data: {
    labels: string[] // As datas ou datas e horas
    plot: number[] // Os valores correspondentes
    interval: string // 'hour' ou 'date'
    metric: string // A métrica selecionada
  }
}

const chartConfig = {
  visitors: {
    label: 'Visitantes',
    color: '#0ea5e9',
  },
} satisfies ChartConfig

// Função para formatar valores conforme a métrica
const formatValue = (value: number | null, metric: string): string => {
  if (value === null) return '0'

  switch (metric) {
    case 'visitors':
    case 'visits':
    case 'pageviews':
      return value.toLocaleString()

    case 'views_per_visit':
      return value.toFixed(2)

    case 'bounce_rate':
      return `${value}%`

    case 'visit_duration': {
      const totalSeconds = Math.floor(value)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`
    }

    default:
      return value.toString()
  }
}

export function VisitorsChart({ data }: VisitorsChartProps) {
  const chartData = data?.labels.map((label, index) => ({
    date: label,
    value: data.plot[index],
  }))

  const formatXAxis = (tickItem: string) => {
    return data.interval === 'hour'
      ? format(new Date(tickItem), 'HH:mm')
      : format(new Date(tickItem), 'dd/MM')
  }

  return (
    <ChartContainer
      config={chartConfig}
      className='relative right-4 h-64 w-full'
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 10,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='date'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatXAxis}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={3}
          domain={[0, 'auto']}
        />
        <Tooltip
          cursor={false}
          contentStyle={{
            backgroundColor: '#061216',
            border: 'none',
            borderRadius: '5px',
          }}
          formatter={(value: number) => formatValue(value, data.metric)}
        />
        <defs>
          <linearGradient id='fillVisitors' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#082f49' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#7dd3fc' stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <Area
          dataKey='value' // Usando 'value' como valor para o gráfico
          name='Total'
          type='natural'
          fill='url(#fillVisitors)'
          fillOpacity={0.4}
          stroke='var(--color-visitors)'
        />
      </AreaChart>
    </ChartContainer>
  )
}
