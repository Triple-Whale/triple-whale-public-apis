import { useState } from 'react'
import { Banner, Button, Layout, Text, LegacyStack } from '@shopify/polaris'
import { useAuth } from '../contexts/Auth'

export const LoggedInCard: React.FC<any> = ({ isApiKey }) => {
  const { authenticated, error, message, loading } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const refreshToken = async () => {
    setRefreshing(true)
    await fetch('/refresh')
    location.reload()
    // setRefreshing(false)
  }

  const refreshPage = () => {
    setRefreshing(true)
    location.reload()
  }

  return (
    <Layout.Section>
      <Banner status={authenticated ? 'success' : 'critical'}>
        {authenticated ? (
          <LegacyStack vertical>
            <Text variant="headingLg" as="h2">
              {isApiKey ? 'Your API Key is present!' : 'You are authenticated!'}
            </Text>
            <Text variant="bodyMd" as="p">
              For documentation on available endpoints and request structure,
              visit{' '}
              <a
                href="https://developers.triplewhale.com/swagger/index.html"
                target="_blank"
              >
                https://developers.triplewhale.com/swagger/index.html
              </a>
            </Text>
          </LegacyStack>
        ) : isApiKey ? (
          <LegacyStack vertical>
            <Text variant="headingLg" as="h2">
              {message || 'Your API Key is Invalid'}
            </Text>
            <Text variant="bodyMd" as="p">
              Please check your API Key and try again. You can also try refreshing the page
            </Text>
            {!loading && (
              <Button loading={refreshing} onClick={refreshPage}>
                Refresh page
              </Button>
            )}
          </LegacyStack>
        ) : (
          <LegacyStack vertical>
            <Text variant="headingLg" as="h2">
              {message || 'Your JWT Expired'}
            </Text>
            <Text variant="bodyMd" as="p">
              We're going to try and refresh your token. If it doesn't work,
              please try to refresh it yourself using the button below.
            </Text>
            <Text variant="bodyMd" as="p">
              {' '}
              If that doesn't work, restart your server, or try again later! 😅
            </Text>
            {!loading && (
              <Button loading={refreshing} onClick={refreshToken}>
                Refresh Token
              </Button>
            )}
          </LegacyStack>
        )}
      </Banner>
      {authenticated && error && (
        <Banner status="critical">
          <LegacyStack vertical>
            <Text variant="headingLg" as="h2">
              API Error: {message}
            </Text>
            <Text variant="bodyMd" as="p">
              View your network tab for more information, or try to
              {!isApiKey ? ' refresh your token.' : ' refresh your API Key.'}
            </Text>
            {!loading && !isApiKey && (
              <Button loading={refreshing} onClick={refreshToken}>
                Refresh Token
              </Button>
            )}
          </LegacyStack>
        </Banner>
      )}
    </Layout.Section>
  )
}
