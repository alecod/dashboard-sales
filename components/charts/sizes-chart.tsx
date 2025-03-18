'use client'

import { MonitorCheck, Smartphone, Tablet } from 'lucide-react'

type SizesChartProps = {
  data: { name: string; visitors: number; percentage: number | null }[]
}

export function SizesChart({ data }: SizesChartProps) {
  const deviceData = {
    Desktop: {
      icon: <MonitorCheck size={65} />,
      percentage: data.find((d) => d.name === 'Desktop')?.percentage ?? 0,
    },
    Mobile: {
      icon: <Smartphone size={65} />,
      percentage: data.find((d) => d.name === 'Mobile')?.percentage ?? 0,
    },
    Tablet: {
      icon: <Tablet size={65} />,
      percentage: data.find((d) => d.name === 'Tablet')?.percentage ?? 0,
    },
  }

  return (
    <div className='mt-16 flex w-full items-center justify-between gap-3'>
      {Object.entries(deviceData).map(([device, { icon, percentage }]) => (
        <div key={device} className='flex flex-col items-center gap-3'>
          {icon}
          <span>
            {device}:{' '}
            <strong>{percentage === 0 ? '0%' : `${percentage}%`}</strong>
          </span>
        </div>
      ))}
    </div>
  )
}
