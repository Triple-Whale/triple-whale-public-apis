export type reducerAction = {
  type: string
  message: string
  active: boolean
}

export interface childrenProps {
  children: JSX.Element;
}

export type ordersWithJourneyOld = {
  count: number,
  totalForRange: number,
  page: number,
  nextPage: number
}

export type ordersWithJourneyNew = {
  totalForRange: number,
  count: number,
  nextPage: number
}