import { useEffect, useState } from 'react'
import { Card, Layout, Spinner, Stack } from '@shopify/polaris';
import { TabbedRequests } from './TabbedRequests'
import { LoginCard } from './LoginCard'
import { LoggedInCard } from './LoggedInCard'
import { useAuth } from '../contexts/Auth'

export const MainSection = () => {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const { authenticated } = useAuth()

  useEffect(() => {
    if(loading)
      fetch('/logged-in')
        .then(res => res.json())
        .then(data => setLoggedIn(!!data?.token))
        .finally(() => setLoading(false))
  }, [])

  return (
    loading ? (
      <Layout.Section>
        <Card sectioned>
          <Spinner />
        </Card>
      </Layout.Section>
    ) : (
      loggedIn && authenticated ? (
        <Stack vertical>
          <LoggedInCard />
          <TabbedRequests />
        </Stack>
      ) : (
        <>
          {loggedIn && (<LoggedInCard />)}
          <LoginCard />
        </>
      )
    )
  )
}