import create from 'zustand'
import { subDays, startOfDay, endOfDay } from 'date-fns'

import type { DateRange } from 'react-day-picker'

interface FilterState {
  dateRange: DateRange
  status: string
  setDateRange: (dateRange?: DateRange) => void
  setStatus: (status: string) => void
}

export const useFilterDashboardHook = create<FilterState>((set) => ({
  dateRange: {
    from: startOfDay(subDays(new Date(), 6)),
    to: endOfDay(new Date()),
  },
  status: 'paid',
  setDateRange: (dateRange) => set({ dateRange }),
  setStatus: (status) => set({ status }),
}))
