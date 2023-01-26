import { useState, useCallback } from 'react';
import { Button, Popover, Stack } from '@shopify/polaris';
import { SummaryDatePicker } from './SummaryDatePicker';

export const SummaryPage: React.FC = () => {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      Select date range
    </Button>
  );

  return (
    <Stack>
      <Stack.Item>
        <Popover
          fullWidth
          active={popoverActive}
          activator={activator}
          autofocusTarget="first-node"
          onClose={togglePopoverActive}
        >
          <SummaryDatePicker />
        </Popover>
      </Stack.Item>
      <Stack.Item fill>
        <Button fullWidth onClick={() => console.log('clicked')}>Fetch Summary Page Data</Button>
      </Stack.Item>
    </Stack>
  );
}