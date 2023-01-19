// express 
export interface twResponse {
  code: number;
  data: object;
}

// tabs
interface Tab {
  id: string;
  content: string;
  tabContent: JSX.Element;
}

export type TabsType = Tab[]

// shared reducer action
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

export type formattedOrder = (string|number)[];

export type formattedOldOrders = formattedOrder[];

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

export type formattedNewOrders = formattedOrder[];

// metrics from api
export interface metricData {
  metricId: string;
  metricName: string;
  type: string;
  value: string | number;
}

export enum metricEnum {
  'clicks',
  'spend',
}

export type metricKeys = keyof typeof metricEnum;

export type EnumMetricKeys = {
  [key in metricKeys]: metricData;
}

export interface metricsBreakdown {
  date: string;
  metrics: EnumMetricKeys
}

export interface formattedMetric {
  id: string;
  metricsBreakdown: metricsBreakdown[]
}

export type metricsData = formattedMetric[]

// metrics in component
export interface metricsDynamicData {
  spendName: string;
  spendValue: string;
  spendDescription: string;
  clicksName: string;
  clicksValue: string;
  clicksDescription: string;
}

// charts
export interface sparkChartDataLineItem {
  key: number;
  value: number;
}

export interface sparkChartObject {
  data: sparkChartDataLineItem[]
}

export type sparkChartData = sparkChartObject[]