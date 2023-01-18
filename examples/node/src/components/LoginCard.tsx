import { useState } from 'react'
import { Button, Card, Layout, Text, Stack } from '@shopify/polaris';

export const LoginCard: React.FC = () => {
  const [loggingIn, setLoggingIn] = useState(false)

  const logIn = async () => {
    setLoggingIn(true)
  
    const loginFetch = await fetch('/login', {
      headers: {
      'Content-Type': 'application/json'
      }
    }).then(res => res.json())

    if(!!loginFetch?.redirect) {
      window.location = loginFetch.redirect
    } else {
      setLoggingIn(false)
    }
  }

  return (
    <Layout.Section>
      <Card sectioned>
        <Stack vertical>
          <Text variant="heading3xl" as="h1">
            Login
          </Text>
          <Text variant="bodyMd" as="p">
            Click login below to initiate TW OAuth2 flow
          </Text>
          <Button fullWidth onClick={logIn} loading={loggingIn}>Login</Button>
        </Stack>
      </Card>
    </Layout.Section>
  )
}