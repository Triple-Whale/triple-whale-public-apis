import { useCallback, useState } from 'react'
import { 
  Button, 
  Text,  
  TextField,
  Stack
} from '@shopify/polaris';
import { useAuthDispatch } from '../contexts/Auth';
import { useToastDispatch } from '../contexts/Toast';
import { metricsDynamicData } from '../types/Types'
import moment from 'moment'

const baseMetrics: metricsDynamicData = {
  spendName: 'Spend',
  spendValue: '200',
  spendDescription: '',
  clicksName: 'Clicks',
  clicksValue: '1234',
  clicksDescription: '',
}

export const PostMetrics: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState(baseMetrics)
  
  // nice with it
  const handleChange = (key: string, value: string) => {
    setMetrics({ 
      ...metrics, 
      // @ts-ignore
      [key]: value
    });
  }

  const authDispatch = useAuthDispatch()
  const toastDispatch = useToastDispatch()

  const submitValid = () => {
    // @ts-ignore
    var valid = Object.keys(metrics).filter((metric: string) => metrics[metric] === '')
    return valid?.length > 0
  }

  const postMetrics = async (): Promise<void> => {
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
            "id": "spend",
            "name": metrics.spendName,
            "value": parseFloat(metrics.spendValue),
            "type": "currency",
            "description": metrics.spendDescription
          },
          {
            "id": "clicks",
            "name": metrics.clicksName,
            "value": parseFloat(metrics.clicksValue),
            "type": "decimal",
            "description": metrics.clicksDescription
          }
        ]
      })
    }).then(res => res.json())

    if(
      postMetrics.message?.length > 0 
      && postMetrics.code !== 401
    ) {
      authDispatch!({ type: 'error', message: postMetrics.message })
      toastDispatch!({ type: 'error', message: postMetrics.message })
    } else if(
      postMetrics.code
      && postMetrics.code !== 200
    ) {
      authDispatch!({ type: 'expired', message: postMetrics.message })
      toastDispatch!({ type: 'error', message: postMetrics.message })

    } else {
      authDispatch!({ type: 'success' })
      toastDispatch!({ type: 'success', message: 'Metric successfully pushed' })

      setMetrics(baseMetrics)
    }

    setLoading(false)
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>POST</code> request to the API endpoint <code>https://api.triplewhale.com/api/v2/tw-metrics/metrics</code>
      </Text>

      <Stack distribution="fillEvenly" spacing="loose">
        <Stack vertical>
          <TextField 
            label={"Currency metric name"}
            value={metrics.spendName}
            disabled={true}
            autoComplete="false"
          />
          <TextField 
            label={"Currency value"}
            value={metrics.spendValue}
            onChange={(v) => handleChange('spendValue', v)}
            autoComplete="false"
            type="number"
          />
          <TextField 
            label={"Currency description"}
            value={metrics.spendDescription}
            onChange={(v) => handleChange('spendDescription', v)}
            autoComplete="false"
          />
        </Stack>
        <Stack vertical>
          <TextField 
            label={"Clicks name"}
            value={metrics.clicksName}
            disabled={true}
            autoComplete="false"
          />
          <TextField 
            label={"Clicks value"}
            value={metrics.clicksValue}
            onChange={(v) => handleChange('clicksValue', v)}
            autoComplete="false"
            type="number"
          />
          <TextField 
            label={"Clicks description"}
            value={metrics.clicksDescription}
            onChange={(v) => handleChange('clicksDescription', v)}
            autoComplete="false"
          />
        </Stack>
      </Stack>
      
      <Button 
        fullWidth 
        onClick={() => postMetrics()}
        disabled={submitValid()}
        loading={loading}
      >Post Metrics</Button>
    </Stack>
  )
}