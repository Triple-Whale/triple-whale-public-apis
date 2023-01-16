import { useCallback, useEffect, useState } from 'react'
import { 
  Button, 
  DataTable, 
  Pagination,
  Text, 
  Select, 
  Spinner, 
  Stack
} from '@shopify/polaris';
import { useAuthDispatch } from '../contexts/Auth';

export const FetchMetrics = () => {
  const [selected, setSelected] = useState('');
  const [options, setOptions] = useState([])
  const [dateRanges, setDateRanges] = useState([])
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState([])
  const authDispatch = useAuthDispatch();

  useEffect(() => {
    if(options.length <= 0) fetch('/date-ranges')
      .then((res) => res.json())
      .then(res => { 
        setDateRanges(res)
        setOptions(res.map(option => ({
          label: option.label,
          value: option.value.id
        })))
        setSelected(res[0].value.id)
      })
  }, [])

  const handleSelectChange = (val) => {
    setSelected(val)
    setOrdersWithJourney([])
    setCurrentPage(0)
  }

  const fetchMetrics = async (sentPage) => {
    setLoading(true)
    const selectedRange = dateRanges.find(range => range.value.id == selected)
    if(selectedRange) {
      const fetchGetMetrics = await fetch(
        `/get-metrics?start=${selectedRange.value.start}&end=${selectedRange.value.end}`, 
        {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())

      if(fetchGetMetrics.message || fetchGetMetrics.code) {
        authDispatch({
          type: 'expired',
          message: fetchGetMetrics.message
        })
      } else {
        setMetrics(fetchGetMetrics)
      }

    }
    setLoading(false)
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a POST request to the API endpoint <code>https://api.triplewhale.com/api/v2/tw-metrics/metrics-data</code>
      </Text>
      <Stack distribution="fillEvenly" alignment="trailing">
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
        <pre>{JSON.stringify(metrics)}</pre>
    </Stack>
  )
}