import { useEffect, useState } from 'react'
import { Banner, Layout, Spinner, LegacyStack } from '@shopify/polaris'
import { TabbedRequests } from './TabbedRequests'
import { LoginCard } from './LoginCard'
import { LoggedInCard } from './LoggedInCard'
import { useAuth } from '../contexts/Auth'

export const MainSection: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [isApiKey, setIsApiKey] = useState(false)
  const { authenticated } = useAuth()

  useEffect(() => {
    if (loading)
      fetch('/logged-in')
        .then((res) => res.json())
        .then((data) => {
          setLoggedIn(!!data?.token)
          setIsApiKey(data?.isApiKey)
        })
        .finally(() => setLoading(false))
  }, [])

  return loading ? (
    <Layout.Section>
      <Banner>
        <Spinner />
      </Banner>
    </Layout.Section>
  ) : loggedIn && authenticated ? (
    <LegacyStack vertical>
      <LoggedInCard isApiKey={isApiKey} />
      <TabbedRequests isApiKey={isApiKey} />
    </LegacyStack>
  ) : (
    <>
      {loggedIn && <LoggedInCard />}
      {!isApiKey && <LoginCard />}
    </>
  )
}
