import { DonutChart, SparkLineChart, LineChart } from '@shopify/polaris-viz';
import { 
  annotationsData,
  sparkChartData,
} from '../types/Types';

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

export const DonutPieChart: React.FC<{data:sparkChartData}> = (props: { data: sparkChartData }) => {
  const { data } = props
  return (
    <div className="donut-wrapper">
      <DonutChart
        data={data}
        legendPosition="left"
        theme="Light"
        renderInnerValueContent={renderInnerValueContent}
      />
    </div>
  )
}

export const SparkChart: React.FC<{data:sparkChartData,accessibilityLabel:string}> = (props: { data: sparkChartData, accessibilityLabel: string }) => {
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

export const ALineChart: React.FC<{data:sparkChartData,annotations?:annotationsData}> = (props: { data: sparkChartData, annotations?: annotationsData }) => {
  const { data, annotations } = props
  return (
    <LineChart
      theme="Light"
      annotations={annotations}
      data={data}
    />
  )
}