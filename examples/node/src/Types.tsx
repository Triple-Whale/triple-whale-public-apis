type Tab = {
  id: string,
  content: string,
  tabContent: JSX.Element
}

export type TabsType = Array<Tab>

export type reducerAction = {
  type: string
  message?: string
  active?: boolean
}

export type toastState = {
  type: string
  message: string
  active: boolean
}

export type authState = {
  authenticated: boolean,
  error: boolean,
  message: string
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
