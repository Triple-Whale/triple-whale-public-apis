import { useEffect, useState } from 'react'
import { Card, Layout, Page, Stack, Text, Spinner } from '@shopify/polaris';
import { TabbedRequests } from './components/TabbedRequests'
import { LoginCard } from './components/LoginCard'
import { LoggedInCard } from './components/LoggedInCard'
import { AuthProvider, useAuth } from './contexts/Auth'

function App() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if(loading)
      fetch('/logged-in')
        .then(res => res.json())
        .then(data => setLoggedIn(!!data?.token))
        .finally(() => setLoading(false))
  }, [])

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Text variant="heading4xl" as="h1">
          🐳🐳🐳 TripleWhale API
          </Text>
        </Layout.Section>

        {loading && (
          <Layout.Section>
            <Card sectioned>
              <Spinner />
            </Card>
          </Layout.Section>
        )}

        <AuthProvider>
          {!loading && (
            loggedIn ? (
              <Stack vertical>
                <LoggedInCard />
                <TabbedRequests />
              </Stack>
            ) : (<LoginCard />)
          )}
        </AuthProvider>
      </Layout>
    </Page>
  )
}

export default App
