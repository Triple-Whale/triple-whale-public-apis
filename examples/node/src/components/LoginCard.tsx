import { useState } from 'react'
import { Button, LegacyCard, Layout, Text, LegacyStack } from '@shopify/polaris'

export const LoginCard: React.FC = () => {
  const [loggingIn, setLoggingIn] = useState(false)

  const logIn = async (): Promise<void> => {
    setLoggingIn(true)

    const loginFetch = await fetch('/login', {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())

    if (loginFetch?.redirect) {
      window.location = loginFetch.redirect
    } else {
      setLoggingIn(false)
    }
  }

  return (
    <Layout.Section>
      <LegacyCard sectioned>
        <LegacyStack vertical>
          <Text variant="heading3xl" as="h1">
            Login
          </Text>
          <Text variant="bodyMd" as="p">
            Click login below to initiate TW OAuth2 flow
          </Text>
          <Button fullWidth onClick={logIn} loading={loggingIn}>
            Login
          </Button>
        </LegacyStack>
      </LegacyCard>
    </Layout.Section>
  )
}
