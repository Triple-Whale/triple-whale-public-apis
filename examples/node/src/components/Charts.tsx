import { DonutChart, SparkLineChart, LineChart } from '@shopify/polaris-viz';

const numberStyles = {
  fontWeight: 600,
}

const renderInnerValueContent = ({activeValue, totalValue}: any, getAnimatedTotalValue: any) => {
  const activeValuePercentage = activeValue
    ? `${(activeValue / totalValue * 100).toFixed(1)}%`
    : null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
    }}>
      {activeValuePercentage && (
        <p style={{
          fontSize: 20,
          margin: 0,
          ...numberStyles,
        }}>
          {activeValuePercentage}
        </p>
      )}
      <p style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        margin: '8px 0',
      }}>
        {activeValue ? (
          <span style={{
            fontSize: 15,
            margin: 0,
            ...numberStyles,
          }}>{`${activeValue} of ${totalValue}`}</span>
        ) : (
          <>
            <span>Total:</span>
            {getAnimatedTotalValue({
              fontSize: 20,
              ...numberStyles
            })}
          </>
        )}
      </p>
    </div>
  )
}

export const DonutPieChart: React.FC<any> = (props: { data: any }) => {
  const { data } = props
  return (
    <DonutChart
      data={data}
      legendPosition="left"
      theme="Light"
      renderInnerValueContent={renderInnerValueContent}
    />
  )
}

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

export const ALineChart: React.FC<any> = (props: { data: any, annotations: any }) => {
  const { data, annotations } = props
  return (
    <LineChart
      theme="Light"
      annotations={annotations}
      data={data}
    />
  )
}