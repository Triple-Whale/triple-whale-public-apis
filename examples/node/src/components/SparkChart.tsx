import { SparkLineChart } from '@shopify/polaris-viz';

export const SparkChart: React.FC<any> = (props: { data: any, accessibilityLabel: any }) => {
  const { data, accessibilityLabel } = props
  return (
    <div className="spark-wrapper">      
      <SparkLineChart
        theme="Light"
        accessibilityLabel={accessibilityLabel}
        data={data}
      />
    </div>
  )
}