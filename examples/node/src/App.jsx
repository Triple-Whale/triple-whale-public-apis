import { Card, Layout, Page, Text, Spinner } from '@shopify/polaris';
import { AuthProvider } from './contexts/Auth'
import { MainSection } from './components/MainSection'

function App() {
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Text variant="heading4xl" as="h1">
          🐳🐳🐳 TripleWhale API
          </Text>
        </Layout.Section>

        <AuthProvider>
          <MainSection />
        </AuthProvider>
      </Layout>
    </Page>
  )
}

export default App
