import { useEffect, useState } from 'react'
import { Card, Layout, Page, Text, Spinner } from '@shopify/polaris';
import { LoginCard } from './components/LoginCard'
import { LoggedInCard } from './components/LoggedInCard'

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

        {!loading && (
          loggedIn ? (<LoggedInCard />) : (<LoginCard />)
        )}
      </Layout>
    </Page>
  )
}

export default App
