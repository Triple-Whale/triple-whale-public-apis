import { useCallback, useState } from 'react'
import { 
  Button, 
  DataTable, 
  Pagination,
  Text, 
  Select, 
  Spinner, 
  Stack
} from '@shopify/polaris';
import { useAuthDispatch } from '../contexts/Auth';
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

export const FetchOrdersWithJourneys = () => {
  const [loading, setLoading] = useState(false)
  const [ordersWithJourney, setOrdersWithJourney] = useState([])
  const [sortedOrders, setSortedOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
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
    setCurrentPage(0)
  }

  const fetchOrdersWithJourney = async (sentPage) => {
    setLoading(true)
    const selectedRange = rawDateRanges.find(range => range.value.id == selected)
    if(selectedRange) {
      const orderJourneys = await fetch('/get-orders-with-journeys', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: selectedRange.value.start,
          endDate: selectedRange.value.end,
          page: sentPage || 0
        })
      }).then(res => res.json())

      if(orderJourneys.message && !orderJourneys.code) {
        authDispatch({
          type: 'error',
          message: orderJourneys.message
        })
      } else if(orderJourneys.code) {
        authDispatch({
          type: 'expired',
          message: orderJourneys.message
        })
      } else {
        authDispatch({ type: 'success' })
        setCurrentPage(orderJourneys.page)
        setOrdersWithJourney(orderJourneys)
        setSortedOrders(formatOrders(orderJourneys.ordersWithJourneys))
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
            <Text alignment="end" variant="headingSm" as="p">Page {ordersWithJourney.page + 1}</Text>
          </Stack>
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
          <Stack distribution="center">
            <Pagination
              hasPrevious={!loading && currentPage > 0}
              previousTooltip={`Page ${currentPage}`}
              onPrevious={async() => {
                await fetchOrdersWithJourney(currentPage - 1)
                window.scrollTo({ top: document.getElementById('table-wrapper')?.offsetTop })
              }}
              hasNext={!loading && ordersWithJourney?.nextPage}
              nextTooltip={`Page ${currentPage + 2}`}
              onNext={async() => {
                await fetchOrdersWithJourney(currentPage + 1)
                window.scrollTo({ top: document.getElementById('table-wrapper')?.offsetTop })
              }}
            />
          </Stack>
        </div>
      )}
    </Stack>
  )
}