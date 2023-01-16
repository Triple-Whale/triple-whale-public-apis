import { useContext } from 'react'
import { 
  Card, 
  Layout,
  Text, 
  Stack
} from '@shopify/polaris';
import { useAuth } from '../contexts/Auth'

export const LoggedInCard = () => {
  const { authenticated, message } = useAuth()

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
          message ? (
            <Stack vertical>
              <Text variant="headingLg" as="h2">{message}</Text>
              <Text variant="bodyMd" as="p">Please restart your server, or try again later!</Text>
            </Stack>
          ) : (
            <Stack vertical>
              <Text variant="headingLg" as="h2">Your JWT Expired</Text>
              <Text variant="bodyMd" as="p">Please restart your server!</Text>
            </Stack>
          )
        )}
      </Card>
    </Layout.Section>
  )
}