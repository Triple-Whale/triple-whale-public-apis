import { createContext, useContext } from 'react'
import moment from 'moment'

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

const DateRanges = createContext(dateRanges);

export function useDateRanges() {
  return useContext(DateRanges);
}