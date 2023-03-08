import { createContext, useContext } from 'react'
import { DatePickerOption } from '../types/Types'
import moment from 'moment'

// V1 RANGES
const dateRanges: DatePickerOption[] = [
  {
    value: {
      start: moment().startOf('day'),
      end: moment().endOf('day'),
      id: 'today',
    },
    label: 'Today',
  },
  {
    value: {
      start: moment().subtract(1, 'day').startOf('day'),
      end: moment().subtract(1, 'day').startOf('day'), //.endOf('day') // bug with endOf day
      id: 'yesterday',
    },
    label: 'Yesterday',
  },
  {
    value: {
      start: moment().subtract(7, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last7Days',
    },
    label: 'Last 7 days',
  },
  {
    value: {
      start: moment().subtract(30, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last30Days',
    },
    label: 'Last 30 days',
  },
  {
    value: {
      start: moment().subtract(90, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last90Days',
    },
    label: 'Last 90 days',
  },
]

export function useDateRanges() {
  return useContext(createContext(dateRanges))
}

// V2 RANGES
const dateRangesV2: DatePickerOption[] = [
  {
    value: {
      start: moment().startOf('day'),
      end: moment().endOf('day'),
      id: 'today',
    },
    label: 'Today',
  },
  {
    value: {
      start: moment().subtract(1, 'day').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'yesterday',
    },
    label: 'Yesterday',
  },
  {
    value: {
      start: moment().subtract(7, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last7Days',
    },
    label: 'Last 7 days',
  },
  {
    value: {
      start: moment().subtract(30, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last30Days',
    },
    label: 'Last 30 days',
  },
  {
    value: {
      start: moment().subtract(90, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last90Days',
    },
    label: 'Last 90 days',
  },
]

export function useDateRangesV2() {
  return useContext(createContext(dateRangesV2))
}

// METRICS DATES
const metricsDateRanges = [
  {
    value: {
      start: moment().subtract(7, 'days').startOf('day'),
      end: moment().endOf('day'),
      id: 'thisweek',
    },
    label: 'This Week',
  },
  {
    value: {
      start: moment().startOf('year'),
      end: moment().endOf('day'),
      id: 'thisyear',
    },
    label: 'This Year',
  },
  {
    value: {
      start: moment().subtract(730, 'day'),
      end: moment().subtract(365, 'day'),
      id: 'lastyear',
    },
    label: 'Last Year',
  },
  {
    value: {
      start: moment('2020-01-01').endOf('day'),
      end: moment().endOf('day'),
      id: 'alltime',
    },
    label: 'All Time',
  },
]

export function useMetricsDateRanges() {
  return useContext(createContext(metricsDateRanges))
}

// SUMMARY DATES
const SummaryDateRanges: DatePickerOption[] = [
  {
    value: {
      start: moment().startOf('day'),
      end: moment().endOf('day'),
      todayHour: moment().hour(),
      id: 'today',
    },
    label: 'Today',
  },
  {
    value: {
      start: moment().subtract(1, 'day').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'), //.endOf('day') // bug with endOf day
      todayHour: 25,
      id: 'yesterday',
    },
    label: 'Yesterday',
  },
  {
    value: {
      start: moment().subtract(7, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last7Days',
    },
    label: 'Last 7 days',
  },
  {
    value: {
      start: moment().subtract(30, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last30Days',
    },
    label: 'Last 30 days',
  },
  {
    value: {
      start: moment().subtract(90, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last90Days',
    },
    label: 'Last 90 days',
  },
]

export function useSummaryDateRanges() {
  return useContext(createContext(SummaryDateRanges))
}
