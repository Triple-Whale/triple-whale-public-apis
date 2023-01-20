import { useState } from 'react'
import { 
  Banner,
  Button,
  Layout,
  Text, 
  Stack
} from '@shopify/polaris';
import { useAuth } from '../contexts/Auth'

export const LoggedInCard: React.FC = () => {
  const { authenticated, error, message, loading } = useAuth()
  const [ refreshing, setRefreshing ] = useState(false)

  const refreshToken = async () => {
    setRefreshing(true)
    await fetch('/refresh')
    setRefreshing(false)
  }

  return (
    <Layout.Section>
      <Banner status={authenticated ? 'success' : 'critical'}>
        {authenticated ? (
          <Stack vertical>
            <Text variant="headingLg" as="h2">You are authenticated!</Text>
            <Text variant="bodyMd" as="p">
              For documentation on available endpoints and request structure, visit <a href="https://developers.triplewhale.com/swagger/index.html" target="_blank">https://developers.triplewhale.com/swagger/index.html</a>
            </Text>
          </Stack>
        ) : (
          <Stack vertical>
            <Text variant="headingLg" as="h2">{message || 'Your JWT Expired'}</Text>
            <Text variant="bodyMd" as="p">We're going to try and refresh your token.. but if it doesn't work, please restart your server, or try again!</Text>
            {!loading && (<Button loading={refreshing} onClick={refreshToken}>Refresh Token</Button>)}
          </Stack>
        )}
      </Banner>
      {authenticated && error && (
        <Banner status="critical">
          <Stack vertical>
            <Text variant="headingLg" as="h2">API Error: {message}</Text>
            <Text variant="bodyMd" as="p">View your network tab for more information, or try to refresh your token.</Text>
            {!loading && (<Button loading={refreshing} onClick={refreshToken}>Refresh Token</Button>)}
          </Stack>
        </Banner>
      )}
    </Layout.Section>
  )
}