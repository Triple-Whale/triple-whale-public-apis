import { useCallback, useContext, useState } from 'react'
import { 
  Button, 
  Text,  
  Stack
} from '@shopify/polaris';
import { useAuthDispatch } from '../contexts/Auth';

export const PostMetrics = () => {
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState([])
  const authDispatch = useAuthDispatch()

  const postMetrics = async () => {
    setLoading(true)

    const postMetrics = await fetch('/post-metrics', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      }
    }).then(res => res.json())

    if(postMetrics.message && postMetrics.code  !== 401) {
      authDispatch({
        type: 'error',
        message: postMetrics.message
      })
    } else if(postMetrics.code) {
      authDispatch({
        type: 'expired',
        message: postMetrics.message
      })
    } else {
      authDispatch({ type: 'success' })
      setMetrics(postMetrics)
    }

    setLoading(false)
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>POST</code> request to the API endpoint <code>https://api.triplewhale.com/api/v2/tw-metrics/metrics</code>
      </Text>
      <Button 
        fullWidth 
        onClick={() => postMetrics()}
        loading={loading}
      >Post Metrics</Button>
      {metrics.length > 0 && (<pre>{JSON.stringify(metrics)}</pre>)}
    </Stack>
  )
}