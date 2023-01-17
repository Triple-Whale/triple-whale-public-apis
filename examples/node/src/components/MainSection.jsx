import { useEffect, useState } from 'react'
import { Banner, Layout, Spinner, Stack } from '@shopify/polaris';
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
       <Banner sectioned>
          <Spinner />
        </Banner>
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