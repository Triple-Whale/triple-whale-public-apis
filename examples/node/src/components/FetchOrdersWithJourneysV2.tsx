import { useCallback, useState } from 'react'
import { 
  Button, 
  DataTable, 
  Text, 
  Select, 
  Spinner, 
  Stack
} from '@shopify/polaris';
import { useAuthDispatch } from '../contexts/Auth';
import { useToastDispatch } from '../contexts/Toast';
import { useDateRangesV2 } from '../contexts/DateRanges';
import { ordersWithJourneyNew } from '../Types';

const formatOrders = (orders: any) => {
  return orders.map((order: any) => ([
    order.order_id, 
    order.journey?.length || 0, 
    order.attribution?.firstClick?.map((click: any) => click.source ?? '').flat().toString().replace(/,/g, ', '),
    order.attribution?.lastClick?.map((click: any) => click.source ?? '').flat().toString().replace(/,/g, ', '),
    order.attribution?.lastPlatformClick?.map((click: any) => click.source ?? '').flat().toString().replace(/,/g, ', ')
  ]))
}

export const FetchOrdersWithJourneysV2: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [ordersWithJourney, setOrdersWithJourney] = useState({} as ordersWithJourneyNew | any)
  const [sortedOrders, setSortedOrders] = useState([])

  const authDispatch = useAuthDispatch()
  const toastDispatch = useToastDispatch()

  const rawDateRanges = useDateRangesV2()
  const dateRanges = rawDateRanges.map(option => ({
    label: option.label,
    value: option.value.id
  }))
  const [selected, setSelected] = useState(dateRanges[0].value);
  const [options] = useState(dateRanges)

  const sortOrders = (orders: any, index: any, direction: any) => {
    return [...orders].sort((rowA, rowB) => {
      const amountA = parseFloat(rowA[index])
      const amountB = parseFloat(rowB[index])

      return direction === 'descending' ? amountB - amountA : amountA - amountB;
    })
  }

  const handleSort = useCallback(
    (index: number, direction: string) => setSortedOrders(sortOrders(sortedOrders, index, direction) as any),
    [sortedOrders]
  )

  const handleSelectChange = (val: string) => {
    setSelected(val)
    setOrdersWithJourney({})
  }

  const fetchOrdersWithJourney = async () => {
    setLoading(true)
    const selectedRange = rawDateRanges.find(range => range.value.id == selected)
    if(selectedRange) {
      const orderJourneys = await fetch('/get-orders-with-journeys-v2', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: selectedRange.value.start,
          endDate: selectedRange.value.end
        })
      }).then(res => res.json())

      if(
        orderJourneys.message?.length > 0
        && orderJourneys.code !== 401
      ) {
        authDispatch!({ type: 'error', message: orderJourneys.message })
        toastDispatch!({ type: 'error', message: orderJourneys.message })
      } else if(
        orderJourneys.code
        && orderJourneys.code !== 200
      ) {
        authDispatch!({ type: 'expired',message: orderJourneys.message})
        toastDispatch!({ type: 'error',message: orderJourneys.message})
      } else {
        authDispatch!({ type: 'success' })
        setOrdersWithJourney(orderJourneys)
        setSortedOrders(formatOrders(orderJourneys.ordersWithJourneys) as any)
      }
    }
    setLoading(false)
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>POST</code> request to the API endpoint <code>https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys-v2</code>
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
          onClick={() => fetchOrdersWithJourney()}
          loading={loading}
        >Fetch Orders with Journey</Button>
        </Stack>
        {loading ?? (
          <Spinner accessibilityLabel="Loading orders" size="large" />
        )}

        {ordersWithJourney.totalForRange > 0 && (
        <div id="table-wrapper" style={{ opacity: loading ? '0.5' : '1' }}>
          <Stack distribution="fill">
            <Text variant="headingSm" as="p">Showing {ordersWithJourney.count} of {ordersWithJourney.totalForRange} total orders</Text>
          </Stack>

          <Stack>
            <DataTable 
              columnContentTypes={[
                'text',
                'text',
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
              rows={sortedOrders}
              onSort={handleSort}
              hasZebraStripingOnData
              sortable={[false, true, false, false, false]}
            />
          </Stack>
        </div>
      )}
    </Stack>
  )
}