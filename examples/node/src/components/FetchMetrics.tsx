import { useRef, useState } from 'react'
import {
  Button,
  Card,
  Select,
  Spinner,
  Stack,
  Text,
  Tooltip,
} from '@shopify/polaris'
import { useAuthDispatch } from '../contexts/Auth'
import { useToastDispatch } from '../contexts/Toast'
import { useMetricsDateRanges } from '../contexts/DateRanges'
import { SparkChart, ALineChart } from './Charts'
import {
  formattedMetric,
  formattedSparkChartsData,
  metricsData,
  metricEnum,
  metricKeys,
  metricsBreakdown,
  sparkChartData,
} from '../types/Types'
import moment from 'moment'
import { DataExport } from '../DataExport'

export const FetchMetrics: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState({} as metricsData)

  const authDispatch = useAuthDispatch()
  const toastDispatch = useToastDispatch()

  const rawDateRanges = useMetricsDateRanges()
  const dateRanges = rawDateRanges.map((option) => ({
    label: option.label,
    value: option.value.id,
  }))
  const [selected, setSelected] = useState(dateRanges[0].value)
  const [options] = useState(dateRanges)

  const [chartsData, setChartsData] = useState({} as formattedSparkChartsData)
  const formatChartsData = (data: formattedMetric) => {
    const cachedMetrics: formattedSparkChartsData = {
      clicks: { name: 'Clicks', value: 0, chart: [{ data: [] }] },
      spend: { name: 'Spend', value: 0, chart: [{ data: [] }] },
    }

    data.metricsBreakdown.forEach((record: metricsBreakdown) => {
      Object.values(metricEnum).forEach((key: string | metricEnum) => {
        const recordMetric = record?.metrics[key as metricKeys] ?? false
        if (recordMetric) {
          const recordVal = parseFloat(recordMetric.value.toString())
          cachedMetrics[key as metricKeys].value += recordVal
          cachedMetrics[key as metricKeys].chart[0].data.push({
            key: recordMetric.metricName.toString(),
            value: recordVal,
            date: record.date,
          })
        }
      })
    })

    return cachedMetrics
  }

  const formatChartNumber = (value: number, name: string) => {
    return name.toLowerCase() === 'spend'
      ? value
          .toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })
          .replace('.00', '')
      : value
  }

  const handleSelectChange = (val: string) => {
    setSelected(val)
    setMetrics([])
    setChartsData({} as formattedSparkChartsData)
  }

  const fetchMetrics = async (): Promise<void> => {
    setLoading(true)
    const selectedRange = rawDateRanges.find(
      (range) => range.value.id == selected
    )
    if (selectedRange) {
      const fetchGetMetrics = await fetch(
        `/get-metrics?start=${moment(selectedRange.value.start).format(
          'YYYY-MM-DD'
        )}&end=${moment(selectedRange.value.end).format('YYYY-MM-DD')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json())

      if (fetchGetMetrics.message?.length > 0 && fetchGetMetrics.code !== 401) {
        authDispatch!({ type: 'error', message: fetchGetMetrics.message })
        toastDispatch!({ type: 'error', message: fetchGetMetrics.message })
      } else if (fetchGetMetrics.code && fetchGetMetrics.code !== 200) {
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

  const initialized = useRef(false)
  if (!initialized.current) {
    fetchMetrics()
    initialized.current = true
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>GET</code> request to the API endpoint{' '}
        <code>https://api.triplewhale.com/api/v2/tw-metrics/metrics-data</code>
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
          <Button fullWidth onClick={() => fetchMetrics()} loading={loading}>
            Fetch Metrics
          </Button>
        </Stack.Item>
        <Stack.Item>
          <Tooltip content="Download Metrics" preferredPosition="above">
            <DataExport
              data={metrics}
              title="metrics"
              disabled={Object.keys(metrics).length <= 0}
            />
          </Tooltip>
        </Stack.Item>
      </Stack>
      {loading ?? <Spinner accessibilityLabel="Loading metrics" size="large" />}
      {Object.keys(metrics).length > 0 && (
        <>
          <Stack wrap={true} distribution="fillEvenly">
            {Object.keys(chartsData).map((key) => (
              <Stack.Item fill key={key}>
                <Card sectioned>
                  <Text variant="bodySm" as="p">
                    {chartsData[key as metricKeys].name}
                  </Text>
                  <Text variant="headingLg" as="h1">
                    {formatChartNumber(
                      chartsData[key as metricKeys].value,
                      chartsData[key as metricKeys].name
                    )}
                  </Text>
                  <SparkChart
                    data={chartsData[key as metricKeys].chart}
                    accessibilityLabel={chartsData[key as metricKeys].name}
                  />
                </Card>
              </Stack.Item>
            ))}
          </Stack>
          <br />

          <Card sectioned>
            <Text variant="bodySm" as="p">
              Combined
            </Text>
            <div className="capitalize">
              <Text variant="headingLg" as="h1">
                {Object.keys(chartsData)
                  .map((key) => key)
                  .toString()
                  .replace(',', ' + ')}
              </Text>
              <br />
            </div>
            <ALineChart
              data={
                Object.keys(chartsData).map((key) => ({
                  data: chartsData[key as metricKeys].chart[0].data.map(
                    (data) => ({
                      key: data.date || data.key,
                      value: data.value,
                    })
                  ),
                  name: chartsData[key as metricKeys].name,
                })) as sparkChartData
              }
            />
          </Card>
        </>
      )}
    </Stack>
  )
}
