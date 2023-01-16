import { useCallback, useContext, useState } from 'react'
import { 
  Button, 
  DataTable, 
  Pagination,
  Text, 
  Select, 
  Spinner, 
  Stack
} from '@shopify/polaris';
import { useAuth, useAuthDispatch } from '../contexts/Auth';
import { useDateRanges } from '../contexts/DateRanges'

const formatOrders = (orders) => {
  return orders.map((order => ([
    order.orderId, 
    order.journey?.length || 0, 
    order.attribution?.firstClick?.source ?? '',
    order.attribution?.lastClick?.source ?? '',
    order.attribution?.lastPlatformClick?.map((click) => click.source ?? '').flat().toString().replace(/,/g, ', ')
  ])))
}

export const FetchOrdersWithJourneysV2 = () => {
  const [loading, setLoading] = useState(false)
  const [ordersWithJourney, setOrdersWithJourney] = useState([])
  const [sortedOrders, setSortedOrders] = useState([])
  const authDispatch = useAuthDispatch()
  const rawDateRanges = useDateRanges()
  const dateRanges = rawDateRanges.map(option => ({
    label: option.label,
    value: option.value.id
  }))
  const [selected, setSelected] = useState(dateRanges[0].value);
  const [options] = useState(dateRanges)

  const sortOrders = (orders, index, direction) => {
    return [...orders].sort((rowA, rowB) => {
      const amountA = parseFloat(rowA[index])
      const amountB = parseFloat(rowB[index])

      return direction === 'descending' ? amountB - amountA : amountA - amountB;
    })
  }

  const handleSort = useCallback(
    (index, direction) => setSortedOrders(sortOrders(sortedOrders, index, direction)),
    [sortedOrders]
  )

  const handleSelectChange = (val) => {
    setSelected(val)
    setOrdersWithJourney([])
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

      if(orderJourneys.message || orderJourneys.code) {
        authDispatch({
          type: 'expired',
          message: orderJourneys.message
        })
      } else {
        setOrdersWithJourney(orderJourneys)
      }

    }
    setLoading(false)
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>POST</code> request to the API endpoint <code>https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys</code>
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
            <Text variant="headingSm" as="p">{ordersWithJourney.totalForRange} total orders</Text>
          </Stack>

          <Stack>
            <Text>@TODO Format + Paginate</Text>
          </Stack>
          
        </div>
      )}
    </Stack>
  )
}