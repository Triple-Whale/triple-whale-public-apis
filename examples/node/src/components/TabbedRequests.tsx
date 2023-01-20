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
      content: 'Journeys',
      info: 'Fetch Orders with Journeys',
      tabContent: <FetchOrdersWithJourneys />
    },
    {
      id: 'fetch-orders-with-journeys-v2',
      content: 'Journeys V2',
      info: 'Fetch Orders with Journeys V2',
      tabContent: <FetchOrdersWithJourneysV2 />
    },
    {
      id: 'fetch-metrics',
      content: 'Metrics',
      info: 'Fetch Sent Metrics',
      tabContent: <FetchMetrics />
    },
    {
      id: 'post-metrics',
      content: 'Send Metrics',
      info: 'Send Custom Metrics to Triple Whale',
      tabContent: <PostMetrics />
    }
  ];

  return (
    <Layout.Section>
      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Card.Section title={tabs[selected].info}>
            {tabs[selected]?.tabContent}
          </Card.Section>
        </Tabs>
      </Card>
    </Layout.Section>
  );
}