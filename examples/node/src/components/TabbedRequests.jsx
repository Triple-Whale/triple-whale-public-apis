import { Card, Layout, Tabs } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { FetchMetrics } from './FetchMetrics'
import { FetchOrdersWithJourneys } from './FetchOrdersWithJourneys'
import { FetchOrdersWithJourneysV2 } from './FetchOrdersWithJourneysV2'
import { PostMetrics } from './PostMetrics'

export const TabbedRequests = () => {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
  []);

  const tabs = [
    {
      id: 'fetch-orders-with-journeys',
      content: 'Fetch Orders With Journeys',
      tabContent: <FetchOrdersWithJourneys />
    },
    {
      id: 'fetch-orders-with-journeys-v2',
      content: 'Fetch Orders With Journeys V2',
      tabContent: <FetchOrdersWithJourneysV2 />
    },
    {
      id: 'fetch-metrics',
      content: 'Fetch Metrics',
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
          <Card.Section title={tabs[selected].accessibilityLabel}>
            {tabs[selected].tabContent}
          </Card.Section>
        </Tabs>
      </Card>
    </Layout.Section>
  );
}