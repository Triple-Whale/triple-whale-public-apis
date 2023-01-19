import { useState } from 'react'
import { 
  Button, 
  Card,
  Text, 
  Select, 
  Spinner, 
  Stack
} from '@shopify/polaris';
import { useAuthDispatch } from '../contexts/Auth';
import { useToastDispatch } from '../contexts/Toast';
import { useMetricsDateRanges } from '../contexts/DateRanges';
import { SparkChart } from './SparkChart'
import { 
  formattedMetric,
  metricsData, 
  metricEnum, 
  metricKeys, 
  metricsBreakdown, 
  sparkChartObject,
  sparkChartData 
} from '../Types'
import moment from 'moment'

export const FetchMetrics: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState({} as metricsData)

  const authDispatch = useAuthDispatch()
  const toastDispatch = useToastDispatch()

  const rawDateRanges = useMetricsDateRanges()
  const dateRanges = rawDateRanges.map(option => ({
    label: option.label,
    value: option.value.id
  }))
  const [selected, setSelected] = useState(dateRanges[0].value);
  const [options] = useState(dateRanges)

  const [chartsData, setChartsData] = useState({} as any)
  const formatChartsData = (data: formattedMetric) => {
    const cachedMetrics = { 
      clicks: { name: 'Clicks', value: 0, chart: [{ data: [] as sparkChartData }] }, 
      spend: { name: 'Spend', value: 0, chart: [{ data: [] as sparkChartData }] } 
    }
    
    data.metricsBreakdown.forEach((record: metricsBreakdown) => {
      Object.values(metricEnum).forEach((key: string | metricEnum) => {
        if(record?.metrics[key as metricKeys]) {
          cachedMetrics[key as metricKeys].value += parseFloat(record?.metrics[key as metricKeys].value.toString())
          cachedMetrics[key as metricKeys].chart[0].data.push(record?.metrics[key as metricKeys] as sparkChartData | any) //@TODO types
        }
      })
    })

    console.log(cachedMetrics)
    return cachedMetrics
  }

  const handleSelectChange = (val: string) => {
    setSelected(val)
    setMetrics([])
    setChartsData([])
  }

  const fetchMetrics = async (): Promise<void> => {
    setLoading(true)
    const selectedRange = rawDateRanges.find(range => range.value.id == selected)
    if(selectedRange) {
      const fetchGetMetrics = await fetch(
        `/get-metrics?start=${moment(selectedRange.value.start).format('YYYY-MM-DD')}&end=${moment(selectedRange.value.end).format('YYYY-MM-DD')}`, 
        {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())

      if(
        fetchGetMetrics.message?.length > 0 
        && fetchGetMetrics.code !== 401
      ) {
        authDispatch!({ type: 'error', message: fetchGetMetrics.message })
        toastDispatch!({ type: 'error', message: fetchGetMetrics.message })
      } else if(
        fetchGetMetrics.code
        && fetchGetMetrics.code !== 200
      ) {
        authDispatch!({ type: 'expired', message: fetchGetMetrics.message })
        toastDispatch!({ type: 'error', message: fetchGetMetrics.message })
      } else {
        authDispatch!({ type: 'success' })
        setMetrics(fetchGetMetrics)
        setChartsData(formatChartsData(fetchGetMetrics.data[0]))
      }

    }
    setLoading(false)
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>GET</code> request to the API endpoint <code>https://api.triplewhale.com/api/v2/tw-metrics/metrics-data</code>
      </Text>
      <Stack wrap={true} distribution="fillEvenly" alignment="trailing">
        <Select
          label="Date range"
          options={options}
          onChange={handleSelectChange}
          value={selected}
        />
        <Button 
          fullWidth 
          onClick={() => fetchMetrics()}
          loading={loading}
        >Fetch Metrics</Button>
        </Stack>
        {loading ?? (
          <Spinner accessibilityLabel="Loading metrics" size="large" />
        )}
        {Object.keys(metrics).length > 0 && (
          <Stack wrap={true} distribution="fillEvenly">
            {Object.keys(chartsData).map((key) => (
              <Card sectioned key={key}>
                <Text variant="headingMd" as='h1'>{chartsData[key].name}</Text>
                <Text variant="bodyMd" as="p">{chartsData[key].value}</Text>
                <SparkChart
                  data={chartsData[key].chart}
                  accessibilityLabel={chartsData[key].name}
                />
              </Card>
            ))}
          </Stack>
        )}
    </Stack>
  )
}