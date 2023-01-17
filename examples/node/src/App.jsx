import { Card, Frame, Layout, Page, Text, Spinner } from '@shopify/polaris';
import { AuthProvider } from './contexts/Auth'
import { ToastProvider } from './contexts/Toast'
import { MainSection } from './components/MainSection'

function App() {
  return (
    <Frame>
      <ToastProvider>
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
      </ToastProvider>
    </Frame>
  )
}

export default App
