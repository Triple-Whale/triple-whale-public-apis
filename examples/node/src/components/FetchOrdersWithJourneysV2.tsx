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
import { SparkChart } from './SparkChart'
import { 
  formattedOrder,
  formattedNewOrders, 
  newOrder, 
  newOrders, 
  ordersWithJourneyNew, 
  platformClick,
  sparkChartData
} from '../Types'

const formatOrders = (orders: newOrders) => {
  return orders.map((order: newOrder) => ([
    order.order_id, 
    order.journey?.length || 0, 
    order.attribution?.firstClick?.map((click: platformClick) => click.source ?? '').flat().toString().replace(/,/g, ',\n'),
    order.attribution?.lastClick?.map((click: platformClick) => click.source ?? '').flat().toString().replace(/,/g, ',\n'),
    order.attribution?.lastPlatformClick?.map((click: platformClick) => click.source ?? '').flat().toString().replace(/,/g, ',\n')
  ]))
}

const formatChartData = (orders: newOrders) => {
  return [
    {
      data: orders.map(((order: newOrder, i: number) => ({
        key: i,
        value: order.journey?.length
      })))
    }
  ]
}

export const FetchOrdersWithJourneysV2: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [ordersWithJourney, setOrdersWithJourney] = useState({} as ordersWithJourneyNew)
  const [sortedOrders, setSortedOrders] = useState([] as formattedNewOrders)
  const [chartData, setChartData] = useState([] as sparkChartData)

  const authDispatch = useAuthDispatch()
  const toastDispatch = useToastDispatch()

  const rawDateRanges = useDateRangesV2()
  const dateRanges = rawDateRanges.map(option => ({
    label: option.label,
    value: option.value.id
  }))
  const [selected, setSelected] = useState(dateRanges[0].value);
  const [options] = useState(dateRanges)

  const sortOrders = (orders: formattedNewOrders, index: number, direction: string) => {
    return [...orders].sort((rowA: formattedOrder, rowB: formattedOrder) => {
      const amountA = parseFloat(rowA[index].toString())
      const amountB = parseFloat(rowB[index].toString())

      return direction === 'descending' ? amountB - amountA : amountA - amountB;
    })
  }

  const handleSort = useCallback(
    (index: number, direction: string) => setSortedOrders(sortOrders(sortedOrders, index, direction)),
    [sortedOrders]
  )

  const handleSelectChange = (val: string) => {
    setSelected(val)
    setOrdersWithJourney({} as ordersWithJourneyNew)
    setSortedOrders([] as formattedNewOrders)
    setChartData([] as sparkChartData)
  }

  const fetchOrdersWithJourney = async (): Promise<void> => {
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
        authDispatch!({ type: 'expired', message: orderJourneys.message})
        toastDispatch!({ type: 'error', message: orderJourneys.message})
      } else {
        authDispatch!({ type: 'success' })
        setOrdersWithJourney(orderJourneys)
        setSortedOrders(formatOrders(orderJourneys.ordersWithJourneys))
        setChartData(formatChartData(orderJourneys?.ordersWithJourneys))
      }
    }
    setLoading(false)
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>POST</code> request to the API endpoint <code>https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys-v2</code>
      </Text>
      <Stack wrap={true} distribution="fillEvenly" alignment="trailing">
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
          <SparkChart 
            data={chartData}
            accessibilityLabel="Orders Journey"
          />
          <Stack distribution="fill">
            <Text variant="headingSm" as="p">Showing {ordersWithJourney.count} of {ordersWithJourney.totalForRange} total orders</Text>
          </Stack>

          <Stack>
            <DataTable 
              stickyHeader={true}
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