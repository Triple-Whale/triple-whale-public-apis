import { Card, Layout, Tabs } from '@shopify/polaris';
import { useEffect, useState, useCallback } from 'react';
import { FetchMetrics } from './FetchMetrics'
import { FetchOrdersWithJourneys } from './FetchOrdersWithJourneys'
import { FetchOrdersWithJourneysV2 } from './FetchOrdersWithJourneysV2'
import { PostMetrics } from './PostMetrics'
import { useAuthDispatch } from '../contexts/Auth';
import { TabsType } from '../Types'

export const TabbedRequests: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const authDispatch = useAuthDispatch();

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelected(selectedTabIndex)
    authDispatch!({ type: 'success' })
    const activeTabId = tabs[selectedTabIndex]?.id
    if(activeTabId) window.location.hash = activeTabId.toString()
  }, []);

  // quasi-router
  useEffect(() => {
    const windowHash = window.location.hash.replace('#', '')
    if(windowHash) {
      const activeTab = tabs?.findIndex(tab => tab.id === windowHash)
      if(activeTab) setSelected(activeTab)
    }
  }, []);

  const tabs : TabsType = [
    {
      id: 'fetch-orders-with-journeys',
      content: 'Get Orders',
      tabContent: <FetchOrdersWithJourneys />
    },
    {
      id: 'fetch-orders-with-journeys-v2',
      content: 'Get Orders V2',
      tabContent: <FetchOrdersWithJourneysV2 />
    },
    {
      id: 'fetch-metrics',
      content: 'Get Metrics',
      tabContent: <FetchMetrics />
    },
    {
      id: 'post-metrics',
      content: 'Post Metrics',
      tabContent: <PostMetrics />
    }
  ];

  return (
    <Layout.Section>
      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Card.Section title={tabs[selected].content}>
            {tabs[selected]?.tabContent}
          </Card.Section>
        </Tabs>
      </Card>
    </Layout.Section>
  );
}