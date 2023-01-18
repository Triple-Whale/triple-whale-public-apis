// tabs
interface Tab {
  id: string;
  content: string;
  tabContent: JSX.Element;
}

export type TabsType = Tab[]

// shared action w/ auth & toast
export interface reducerAction {
  type: string;
  message?: string;
  active?: boolean;
}

export type toastState = reducerAction

export interface authState {
  authenticated: boolean;
  error: boolean;
  message: string;
}

export interface childrenProps {
  children: JSX.Element;
}

// old orders
export interface platformClick {
  campaignId: string;
  clickDate: string;
  source: string;
}

interface journey {
  event: string;
  time: string;
  path: string;
}

interface attributionOld {
  firstClick: platformClick;
  lastClick: platformClick;
  lastPlatformClick: platformClick[]
  linearAll: platformClick[]
}

export interface oldOrder {
  orderId: string;
  created_at: string;
  journey: journey[];
  attribution: attributionOld;
}

export type oldOrders = oldOrder[]

export interface ordersWithJourneyOld {
  count: number;
  totalForRange: number;
  page: number;
  nextPage: number;
  orders: oldOrder[];
}

export type formattedOldOrders = (string|number)[][];

// new orders
interface attributionNew {
  firstClick: platformClick[];
  lastClick: platformClick[];
  lastPlatformClick: platformClick[]
  linearAll: platformClick[]
}

export interface newOrder {
  order_id: string;
  created_at: string;
  journey: journey[];
  attribution: attributionNew;
}

export type newOrders = newOrder[]

export interface ordersWithJourneyNew {
  totalForRange: number;
  count: number;
  nextPage: number;
}

export type formattedNewOrders = (string|number)[][];
