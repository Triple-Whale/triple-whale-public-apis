import React, { Suspense } from 'react'
import {
  LegacyCard,
  Layout,
  Tabs,
  SkeletonBodyText,
  SkeletonDisplayText,
} from '@shopify/polaris'
import { useEffect, useState, useCallback } from 'react'
import { useAuthDispatch } from '../contexts/Auth'
import { TabsType } from '../types/Types'

// code splitting
const FetchMetrics = React.lazy(
  async () =>
    await import('./FetchMetrics').then((c) => ({ default: c.FetchMetrics }))
)
const FetchOrdersWithJourneysV2 = React.lazy(
  async () =>
    await import('./FetchOrdersWithJourneysV2').then((c) => ({
      default: c.FetchOrdersWithJourneysV2,
    }))
)
const SummaryPage = React.lazy(
  async () =>
    await import('./SummaryPage').then((c) => ({ default: c.SummaryPage }))
)
const PostMetrics = React.lazy(
  async () =>
    await import('./PostMetrics').then((c) => ({ default: c.PostMetrics }))
)

const fallback = (
  <>
    <br />
    <SkeletonBodyText />
    <SkeletonBodyText lines={1} />
    <br />
    <SkeletonDisplayText />
  </>
)

export const TabbedRequests: React.FC<any> = ({ isApiKey }) => {
  const [selected, setSelected] = useState(0)
  const authDispatch = useAuthDispatch()

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelected(selectedTabIndex)
    authDispatch!({ type: 'success' })
    const activeTabId = tabs[selectedTabIndex]?.id
    if (activeTabId) window.location.hash = activeTabId.toString()
  }, [])

  // quasi-router
  useEffect(() => {
    const windowHash = window.location.hash.replace('#', '')
    if (windowHash) {
      const activeTab = tabs?.findIndex((tab) => tab.id === windowHash)
      if (activeTab) setSelected(activeTab)
    }
  }, [])

  const tabs = [
    {
      id: 'summary-page',
      content: 'Summary Page',
      info: 'Fetch Summary Page Data',
      tabContent: <SummaryPage />,
    },
    {
      id: 'fetch-orders-with-journeys-v2',
      content: 'Journeys',
      info: 'Fetch Orders with Journeys V2',
      tabContent: <FetchOrdersWithJourneysV2 />,
    },
    ...(isApiKey
      ? []
      : [
          {
            id: 'fetch-metrics',
            content: 'Metrics',
            info: 'Fetch Sent Metrics',
            tabContent: <FetchMetrics />,
          },
          {
            id: 'post-metrics',
            content: 'Send Metrics',
            info: 'Send Custom Metrics to Triple Whale',
            tabContent: <PostMetrics />,
          },
        ]),
  ] as TabsType

  return (
    <Layout.Section>
      <LegacyCard>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <LegacyCard.Section title={tabs[selected].info}>
            <Suspense fallback={fallback}>
              {tabs[selected]?.tabContent}
            </Suspense>
          </LegacyCard.Section>
        </Tabs>
      </LegacyCard>
    </Layout.Section>
  )
}
