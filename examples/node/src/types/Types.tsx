import { 
  SummaryMetricIdsTypes,
  SummaryMetricsStatsSelectorsNames
} from '../types/SummaryData'

// tabs
interface Tab {
  id: string;
  content: string;
  info?: string;
  tabContent: JSX.Element;
}

export type TabsType = Tab[]

// shared reducer action
export enum enumAuthTypes {
  'authenticated',
  'expired',
  'error',
  'success',
  'loading'
}

export interface authAction {
  type: string;
  message?: string;
  active?: boolean;
}
// auth
export interface authState {
  authenticated: boolean;
  error: boolean;
  message: string;
  loading: boolean;
}

// toast
export enum enumToastTypes {
  'success',
  'error'
}

export type toastAction = {
  type: string;
  message?: string;
  active?: boolean;
}

export type toastState = toastAction


export interface childrenProps {
  children: JSX.Element;
}

// old orders
export interface platformClick {
  campaignId: string;
  clickDate: moment.Moment;
  source: string;
}

interface journey {
  event: string;
  time: string;
  path: string;
}

export interface attributionOld {
  firstClick: platformClick;
  lastClick: platformClick;
  lastPlatformClick?: platformClick[]
  linearAll?: platformClick[]
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
  ordersWithJourneys: oldOrder[];
}

export type formattedOrder = (string|number)[];

export type formattedOldOrders = formattedOrder[];

// new orders
export interface attributionNew {
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
  earliestDate?: string;
  ordersWithJourneys: newOrder[]
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
  date: moment.Moment;
  metrics: EnumMetricKeys;
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

// spark chart
export interface sparkChartDataLineItem {
  key: number | string;
  value: number;
  date?: moment.Moment;
}

export interface sparkChartObject {
  data: sparkChartDataLineItem[]
  name?: string;
  isComparison?: boolean;
}

export type sparkChartData = sparkChartObject[]

export interface formattedSparkChartInfo {
  value: number;
  name: string;
  chart: [sparkChartObject]
}

export type formattedSparkChartsData = {
  [key in metricKeys]: formattedSparkChartInfo;
}

// annotations
export interface annotationsObject {
  axis: "x" | "y";
  label: string;
  startKey: number;
}

export type annotationsData = annotationsObject[]

// donut chart
export interface donutDataLineItemData {
  name: string;
  data: sparkChartDataLineItem[];
}

export interface donutDataLineItemObject { 
  name: string;
  data: donutDataLineItemData[]
}

export enum donutDataEnum {
  'firstClick',
  'lastClick',
  'lastPlatformClick',
}

export type donutDataKeys = keyof typeof donutDataEnum;

export type donutDataObject = {
  [key in donutDataKeys]?: donutDataLineItemObject;
}

// data export
export interface dataExportProps { 
  data: any, 
  title: string, 
  disabled: boolean 
}

// summary page data
export type DatePickerOption = {
  value: {
    start: moment.Moment;
    end: moment.Moment;
    id: string;
    specialPeriod?: 'week' | 'month' | 'quarter' | 'year';
  };
  label: string | JSX.Element;
};

interface period {
 start: moment.Moment;
 end: moment.Moment;
}

export enum ShopifySegmentType {
  SOURCES = 'sources',
  PAYMENT_GATEWAY_COSTS = 'payment_gateway_costs',
  CUSTOMER_TAGS = 'customer_tags',
  ORDER_TAGS = 'order_tags',
}

interface orderSegment {
  id: string;
  type: ShopifySegmentType;
}

export interface SummaryPageRequest {
  shopDomain: string;
  periods: {
    start: string;
    end: string;
  }[];
  todayHour: number;
  key: moment.Moment | string;
  includeCalculatedStats?: boolean;
  includeRawStats?: boolean;
  activeOrderSegment: {
    id: string;
    type: string;
  }[];
}

export interface compareStats {
  shopDomain: string;
  periods: period[];
  todayHour: number;
  key: moment.Moment | string;
  includeCalculatedStats: boolean;
  includeRawStats: boolean;
  activeOrderSegment: orderSegment[];
}

export type SummaryPageResponse = {
  key: string;
  comparisons: any[];
  calculatedStats?: any;
  previousPeriodRawStats?: any;
};

export interface formattedDictatedService {
  id: SummaryMetricIdsTypes;
  title: string;
  tip: string;
  metricId: SummaryMetricsStatsSelectorsNames;
  value: string | number;
  delta: number;
  chart: sparkChartDataLineItem[];
  type: string;
  positiveComparison: number;
}

export const ServiceMap = {
  amazon: 'Amazon',
  attentive: 'Attentive',
  benchmarks: 'Benchmarks',
  blended: 'Blended',
  enquirelabs: 'Fairing',
  facebook: 'Facebook',
  googleAds: 'Google Ads',
  googleAnalytics: 'Google Analytics',
  gorgias: 'Gorgias',
  influencers: 'Influencers',
  instagram: 'Instagram',
  klaviyo: 'Klaviyo',
  kno: 'Kno',
  pinterest: 'Pinterest',
  pixel: 'Pixel',
  recharge: 'Recharge',
  shopify: 'Shopify',
  snapchat: 'Snapchat',
  tiktok: 'Tiktok',
  tripleWhale: 'Triple Whale',
}

export type IServiceMap = keyof typeof ServiceMap

export type DictatedData = {
  [key in keyof typeof ServiceMap]: formattedDictatedService[]
}