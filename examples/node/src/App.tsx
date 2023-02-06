import { Frame, Layout, Page, Text } from '@shopify/polaris'
import { PolarisVizProvider } from '@shopify/polaris-viz'
import { AuthProvider } from './contexts/Auth'
import { ToastProvider } from './contexts/Toast'
import { MainSection } from './components/MainSection'

import '@shopify/polaris-viz/build/esm/styles.css'

function App() {
  return (
    <Frame>
      <PolarisVizProvider>
        <ToastProvider>
          <Page fullWidth>
            <Layout>
              <Layout.Section>
                <Text variant="heading4xl" as="h1">
                  🐳🐳🐳 Triple Whale API
                </Text>
              </Layout.Section>

              <AuthProvider>
                <MainSection />
              </AuthProvider>
            </Layout>
          </Page>
        </ToastProvider>
      </PolarisVizProvider>
    </Frame>
  )
}

export default App
