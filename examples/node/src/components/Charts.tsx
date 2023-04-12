import { DonutChart, SparkLineChart, LineChart } from '@shopify/polaris-viz'
import { annotationsData, sparkChartData } from '../types/Types'

export const DonutPieChart: React.FC<{ data: sparkChartData }> = (props: {
  data: sparkChartData
}) => {
  const { data } = props
  return (
    <div className="donut-wrapper">
      <DonutChart data={data as any} legendPosition="left" theme="Light" />
    </div>
  )
}

export const SparkChart: React.FC<{
  data: sparkChartData
  accessibilityLabel: string
}> = (props: { data: sparkChartData; accessibilityLabel: string }) => {
  const { data, accessibilityLabel } = props
  return (
    <div className="spark-wrapper">
      <SparkLineChart
        theme="Light"
        accessibilityLabel={accessibilityLabel}
        data={data as any}
      />
    </div>
  )
}

export const ALineChart: React.FC<{
  data: sparkChartData
  annotations?: annotationsData
}> = (props: { data: sparkChartData; annotations?: annotationsData }) => {
  const { data, annotations } = props
  return (
    <LineChart theme="Light" annotations={annotations} data={data as any} />
  )
}
