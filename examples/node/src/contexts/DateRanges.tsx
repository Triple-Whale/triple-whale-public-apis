import { createContext, useContext } from 'react'
import moment from 'moment'

// V1 RANGES
const dateRanges = [
  {
    value: {
      start: moment().startOf('day'),
      end: moment().endOf('day'),
      id: 'today'
    },
    label: 'Today'
  },
  {
    value: {
      start: moment().subtract(1, 'day').startOf('day'),
      end: moment().subtract(1, 'day').startOf('day'), //.endOf('day') // bug with endOf day
      id: 'yesterday'
    },
    label: 'Yesterday'
  },
  {
    value: {
      start: moment().subtract(7, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last7Days'
    },
    label: 'Last 7 days'
  },
  {
    value: {
      start: moment().subtract(30, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last30Days'
    },
    label: 'Last 30 days'
  },
  {
    value: {
      start: moment().subtract(90, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last90Days'
    },
    label: 'Last 90 days'
  }
]

export function useDateRanges() {
  return useContext(createContext(dateRanges));
}

// V2 RANGES
const dateRangesV2 = [
  {
    value: {
      start: moment().startOf('day'),
      end: moment().endOf('day'),
      id: 'today'
    },
    label: 'Today'
  },
  {
    value: {
      start: moment().subtract(1, 'day').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'yesterday'
    },
    label: 'Yesterday'
  },
  {
    value: {
      start: moment().subtract(7, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last7Days'
    },
    label: 'Last 7 days'
  },
  {
    value: {
      start: moment().subtract(30, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last30Days'
    },
    label: 'Last 30 days'
  },
  {
    value: {
      start: moment().subtract(90, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last90Days'
    },
    label: 'Last 90 days'
  }
]

export function useDateRangesV2() {
  return useContext(createContext(dateRangesV2));
}

// METRICS DATES
const metricsDateRanges = [
  {
    value: {
      start: moment().startOf('year'),
      end: moment().endOf('day'),
      id: 'thisyear'
    },
    label: 'This Year'
  },
  {
    value: {
      start: moment().subtract(365, 'day'),
      end: moment().endOf('day'),
      id: 'lastyear'
    },
    label: 'Last Year'
  },
  {
    value: {
      start: moment().subtract(9999, 'day'),
      end: moment().endOf('day'),
      id: 'alltime'
    },
    label: 'All Time'
  }
]

export function useMetricsDateRanges() {
  return useContext(createContext(metricsDateRanges));
}