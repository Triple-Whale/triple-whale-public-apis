import { useCallback, useState } from 'react'
import { 
  Button, 
  Text,  
  TextField,
  Stack
} from '@shopify/polaris';
import { useAuthDispatch } from '../contexts/Auth';
import { useToastDispatch } from '../contexts/Toast';
import moment from 'moment'

export const PostMetrics: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const [metricName, setMetricName] = useState('')
  const handleName = useCallback((v: string) => setMetricName(v), []);
  const [metricValue, setMetricValue] = useState('')
  const handleValue = useCallback((v: string) => setMetricValue(v), []);
  const [metricDescription, setMetricDescription] = useState('')
  const handleDescription = useCallback((v: string) => setMetricDescription(v), []);

  const authDispatch = useAuthDispatch() as any
  const toastDispatch = useToastDispatch() as any

  const submitValid = () => metricName == '' || metricDescription == ''

  const postMetrics = async () => {
    setLoading(true)

    const postMetrics = await fetch('/post-metrics', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: moment().endOf('day').format('YYYY-MM-DD'),
        hour: moment().format('HH'),
        metrics: [
          {
            id: Math.floor(Math.random() * 999).toString(),
            name: metricName,
            value: parseFloat(metricValue),
            type: "decimal",
            description: metricDescription
          }
        ]
      })
    }).then(res => res.json())

    if(
      postMetrics.message?.length > 0 
      && postMetrics.code !== 401
    ) {
      authDispatch({ type: 'error', message: postMetrics.message })
      toastDispatch({ type: 'error', message: postMetrics.message })
    } else if(
      postMetrics.code
      && postMetrics.code !== 200
    ) {
      authDispatch({ type: 'expired', message: postMetrics.message })
      toastDispatch({ type: 'error', message: postMetrics.message })

    } else {
      authDispatch({ type: 'success' })
      toastDispatch({ type: 'success', message: 'Metric successfully pushed' })

      setMetricName('')
      setMetricValue('')
      setMetricDescription('')
    }

    setLoading(false)
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>POST</code> request to the API endpoint <code>https://api.triplewhale.com/api/v2/tw-metrics/metrics</code>
      </Text>
      <TextField 
        label="Metric Name"
        value={metricName}
        onChange={handleName}
        autoComplete="false"
      />
      <TextField 
        label="Metric Value"
        value={metricValue}
        onChange={handleValue}
        autoComplete="false"
        type="number"
      />
      <TextField 
        label="Metric Description"
        value={metricDescription}
        onChange={handleDescription}
        autoComplete="false"
      />
      <Button 
        fullWidth 
        onClick={() => postMetrics()}
        disabled={submitValid()}
        loading={loading}
      >Post Metrics</Button>
    </Stack>
  )
}