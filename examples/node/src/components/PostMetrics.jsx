import { 
  Button, 
  Text, 
  Select, 
  Spinner, 
  Stack
} from '@shopify/polaris';

export const PostMetrics = () => {
  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>POST</code> request to the API endpoint <code>https://api.triplewhale.com/api/v2/tw-metrics/metrics</code>
      </Text>
    </Stack>
  )
}