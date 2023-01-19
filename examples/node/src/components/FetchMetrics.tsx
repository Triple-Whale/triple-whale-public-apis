import { useState } from 'react'
import { 
  Button, 
  Text, 
  Select, 
  Spinner, 
  Stack
} from '@shopify/polaris';
import { useAuthDispatch } from '../contexts/Auth';
import { useToastDispatch } from '../contexts/Toast';
import { useMetricsDateRanges } from '../contexts/DateRanges';
import moment from 'moment'

export const FetchMetrics: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState({})

  const authDispatch = useAuthDispatch()
  const toastDispatch = useToastDispatch()

  const rawDateRanges = useMetricsDateRanges()
  const dateRanges = rawDateRanges.map(option => ({
    label: option.label,
    value: option.value.id
  }))
  const [selected, setSelected] = useState(dateRanges[0].value);
  const [options] = useState(dateRanges)

  const handleSelectChange = (val: string) => {
    setSelected(val)
    setMetrics([])
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
        {Object.keys(metrics).length > 0 && (<pre>{JSON.stringify(metrics)}</pre>)}
    </Stack>
  )
}