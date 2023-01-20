import { useRef, useState } from 'react'
import { 
  Button, 
  Card,
  Select, 
  Spinner, 
  Stack,
  Text, 
  Tooltip
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
  sparkChartDataLineItem
} from '../Types'
import moment from 'moment'
import { DataExport } from '../DataExport';

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

  const [chartsData, setChartsData] = useState([] as any)
  const formatChartsData = (data: formattedMetric) => {
    const cachedMetrics = { 
      clicks: { name: 'Clicks', value: 0, chart: [{ data: [] as sparkChartDataLineItem[] }] }, 
      spend: { name: 'Spend', value: 0, chart: [{ data: [] as sparkChartDataLineItem[] }] } 
    }
    
    data.metricsBreakdown.forEach((record: metricsBreakdown) => {
      Object.values(metricEnum).forEach((key: string | metricEnum) => {
        const recordMetric = record?.metrics[key as metricKeys] ?? false
        if(recordMetric) {
          const recordVal = parseFloat(recordMetric.value.toString())
          cachedMetrics[key as metricKeys].value += recordVal
          cachedMetrics[key as metricKeys].chart[0].data.push({
            key: recordMetric.metricName.toString(),
            value: recordVal
          })
        }
      })
    })

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

  const initialized = useRef(false);
  if (!initialized.current) {
    fetchMetrics()
    initialized.current = true;
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>GET</code> request to the API endpoint <code>https://api.triplewhale.com/api/v2/tw-metrics/metrics-data</code>
      </Text>
      <Stack wrap={true} alignment="trailing">
        <Stack.Item fill>
          <Select
            label="Date range"
            options={options}
            onChange={handleSelectChange}
            value={selected}
          />
        </Stack.Item>
        <Stack.Item fill>
          <Button 
            fullWidth 
            onClick={() => fetchMetrics()}
            loading={loading}
          >Fetch Metrics</Button>
        </Stack.Item>
        <Stack.Item>
          <Tooltip 
            content="Download Metrics"
            preferredPosition="above"
          >
            <DataExport
              data={metrics}
              title="metrics"
              loading={loading}
              disabled={Object.keys(metrics).length <= 0}
            />
          </Tooltip>
        </Stack.Item>
      </Stack>
      {loading ?? (<Spinner accessibilityLabel="Loading metrics" size="large" />)}
      {Object.keys(metrics).length > 0 && (
        <Stack wrap={true} distribution="fillEvenly">
          {Object.keys(chartsData).map((key) => (
            <Card sectioned key={key}>
              <Text variant="bodySm" as="p">{chartsData[key].name}</Text>
              <Text variant="headingLg" as='h1'>{chartsData[key].value}</Text>
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