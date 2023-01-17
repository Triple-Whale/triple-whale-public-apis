import { useContext } from 'react'
import { 
  Card, 
  Layout,
  Text, 
  Stack
} from '@shopify/polaris';
import { useAuth } from '../contexts/Auth'

export const LoggedInCard = () => {
  const { authenticated, error, message } = useAuth()

  return (
    <Layout.Section>
      <Card sectioned>
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
            <Text variant="bodyMd" as="p">Please login, restart your server, or try again later!</Text>
          </Stack>
        )}
      </Card>
      {authenticated && error && (
        <Card sectioned>
          <Stack vertical>
            <Text variant="headingLg" as="h2">API Error: {message}</Text>
            <Text>View your network tab for more information</Text>
          </Stack>
        </Card>
      )}
    </Layout.Section>
  )
}