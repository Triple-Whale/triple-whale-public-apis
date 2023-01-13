import { useEffect, useState } from 'react'
import { 
  Button, 
  Card, 
  DataTable, 
  Layout,
  Text, 
  Select, 
  Spinner, 
  Stack
} from '@shopify/polaris';

export const LoggedInCard = () => {
  const [selected, setSelected] = useState('');
  const [dateRanges, setDateRanges] = useState([])
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [ordersWithJourney, setOrdersWithJourney] = useState([])
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if(options.length <= 0) fetch('/date-ranges')
      .then((res) => res.json())
      .then(res => { 
        setDateRanges(res)
        setOptions(res.map(option => ({
          label: option.label,
          value: option.value.id
        })))
        setSelected(res[0].value.id)
      })
  })

  const handleSelectChange = (val) => {
    setSelected(val)
    setOrdersWithJourney([])
  }

  const fetchOrdersWithJourney = async () => {
    setLoading(true)
    const selectedRange = dateRanges.find(range => range.value.id == selected)
    if(selectedRange) {
      const orderJourneys = await fetch('/get-orders-with-journeys', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: selectedRange.value.start,
          endDate: selectedRange.value.end
        })
      }).then(res => res.json())

      if(orderJourneys.message || orderJourneys.code == 401) {
        setExpired(true)
      } else {
        setOrdersWithJourney(orderJourneys)
      }

    }
    setLoading(false)
  }

  return (!expired ? (
    <Layout.Section>
      <Card sectioned>
        <Stack vertical>
          <Text variant="headingLg" as="h2">You are authenticated!</Text>
          <Text variant="bodyMd" as="p">
            Below will make a POST request to the API endpoint <code>https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys</code>
          </Text>
          <Text variant="bodyMd" as="p">
            For documentation on available endpoints and request structure, visit <a href="https://developers.triplewhale.com" target="_blank">https://developers.triplewhale.com</a>
          </Text>
          <Stack distribution="fillEvenly" alignment="trailing">
            <Select
              label="Date range"
              options={options}
              onChange={handleSelectChange}
              value={selected}
            />
            <Button 
              fullWidth 
              onClick={fetchOrdersWithJourney}
              loading={loading}
            >Fetch Orders with Journey</Button>
           </Stack>
           {loading ?? (
            <Spinner accessibilityLabel="Loading orders" size="large" />
           )}

           {ordersWithJourney.totalForRange > 0 && (
            <Stack vertical>
              <Text variant="bodyMd" as="p">{ordersWithJourney.totalForRange} total orders</Text>
              <DataTable 
                columnContentTypes={[
                  'numeric',
                  'numeric',
                  'text',
                  'text',
                  'text',
                ]}
                headings={[
                  'Order ID',
                  'Journey Length',
                  'First Click',
                  'Last Click',
                  'Last Platform Click',
                ]}
                rows={ordersWithJourney.ordersWithJourneys.map((order => ([
                  order.orderId, 
                  order.journey?.length || 0, 
                  order.attribution?.firstClick?.source ?? '',
                  order.attribution?.lastClick?.source ?? '',
                  order.attribution?.lastPlatformClick?.map((click) => click.source ?? '').flat().toString().replace(/,/g, ', ')
                ])))}
              />
            </Stack>
           )}
        </Stack>
      </Card>
    </Layout.Section>
  ) : (
    <Layout.Section>
      <Card sectioned>
        <Stack vertical>
          <Text variant="headingLg" as="h2">Your JWT Expired</Text>
          <Text variant="bodyMd" as="p">Please restart your server!</Text>
        </Stack>
      </Card>
    </Layout.Section>
  ))
}