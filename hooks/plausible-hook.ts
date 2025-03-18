import { format, subDays } from 'date-fns'
import create from 'zustand'

// Tipagem para o estado da store
interface PlausibleState {
	period: string
	date: string
	interval: string
	metric: string
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any | null
	setPeriodAndDate: (newPeriod: string) => void
	setMetric: (metric: string) => void
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	setData: (newData: any) => void
}

const usePlausibleHook = create<PlausibleState>(set => ({
	period: '7d',
	date: format(new Date(), 'yyyy-MM-dd'),
	interval: 'date',
	metric: 'visitors',
	data: null,

	setPeriodAndDate: (newPeriod: string) => {
		const today = new Date()
		let newDate = format(today, 'yyyy-MM-dd')
		let interval = 'date'
		let period = newPeriod

		if (newPeriod === 'today') {
			newDate = format(today, 'yyyy-MM-dd')
			interval = 'hour'
			period = 'day'
		} else if (newPeriod === 'day') {
			newDate = format(subDays(today, 1), 'yyyy-MM-dd')
			interval = 'hour'
		} else if (newPeriod === 'realtime') {
			interval = 'minute'
		} else if (newPeriod === '7d' || newPeriod === '30d') {
			interval = 'date'
		} else if (newPeriod === 'month') {
			newDate = format(today, 'yyyy-MM-dd')
			interval = 'date'
		} else if (newPeriod === 'all') {
			interval = 'date'
		}

		set({
			period: period,
			date: newDate,
			interval: interval,
		})
	},

	setMetric: (newMetric: string) => {
		set({ metric: newMetric })
	},

	setData: newData => {
		set({ data: newData })
	},
}))

export default usePlausibleHook
