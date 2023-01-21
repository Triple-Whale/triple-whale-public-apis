import { useCallback, useRef, useState } from 'react'
import { 
  Button, 
  Card,
  DataTable, 
  Select, 
  Spinner, 
  Stack,
  Text, 
  Tooltip
} from '@shopify/polaris';
import { useAuthDispatch } from '../contexts/Auth';
import { useToastDispatch } from '../contexts/Toast';
import { useDateRangesV2 } from '../contexts/DateRanges';
import { DonutPieChart, SparkChart } from './Charts'
import { 
  formattedOrder,
  formattedNewOrders, 
  newOrder, 
  newOrders, 
  ordersWithJourneyNew, 
  platformClick,
  sparkChartData
} from '../Types'
import { DataExport } from '../DataExport';

const formatOrders = (orders: newOrders) => {
  return orders.map((order: newOrder) => ([
    order.order_id, 
    order.journey?.length || 0, 
    order.attribution?.firstClick?.map((click: platformClick) => click.source ?? '').flat().toString().replace(/,/g, '\n'),
    order.attribution?.lastClick?.map((click: platformClick) => click.source ?? '').flat().toString().replace(/,/g, '\n'),
    order.attribution?.lastPlatformClick?.map((click: platformClick) => click.source ?? '').flat().toString().replace(/,/g, '\n')
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

const formatDonutData = (orders: newOrders) => {
  const rawData = {
    firstClick: { name: "First Click", data: [] as any },
    lastClick: { name: "Last Click", data: [] as any },
    // lastPlatformClick: { name: "Last Platform Click", data: [] as any }
  }

  orders.map((order: newOrder) => {
    return Object.keys(rawData).map((key: string) => {
      // @ts-ignore
      let source = order?.attribution[key][0] && order?.attribution[key][0].source || false
      // @ts-ignore
      const currentVal = rawData[key].data.find((o: any) => {
        // @ts-ignore
        if(source && Array.isArray(source)) source = source.flat().toString().replace(/,/g, '\n')
        return o.name === source
      })

      console.log(source)

      // @ts-ignore
      if(source) {
        if(!currentVal) {
          // @ts-ignore
          rawData[key].data.push({
            data: [
              {
                 // @ts-ignore
                key: rawData[key].name,
                value: 1
              }
            ],
            // @ts-ignore
            name: source
          })
        } else {
          currentVal.data[0].value += 1
        }
      }
    })
  })

  return rawData
}

export const FetchOrdersWithJourneysV2: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [ordersWithJourney, setOrdersWithJourney] = useState({} as ordersWithJourneyNew)
  const [sortedOrders, setSortedOrders] = useState([] as formattedNewOrders)
  const [chartData, setChartData] = useState([] as sparkChartData)
  const [donutData, setDonutData] = useState({} as any)

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
    setDonutData([] as any)
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
        setSortedOrders(formatOrders(orderJourneys?.ordersWithJourneys))
        setChartData(formatChartData(orderJourneys?.ordersWithJourneys))
        setDonutData(formatDonutData(orderJourneys?.ordersWithJourneys))
      }
    }
    setLoading(false)
  }

  const initialized = useRef(false);
  if (!initialized.current) {
    fetchOrdersWithJourney()
    initialized.current = true;
  }

  return (
    <Stack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>POST</code> request to the API endpoint <code>https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys-v2</code>
      </Text>
      <Stack wrap={true} alignment="trailing">
        <Stack.Item fill>
          <Select
            label="Date range"
            options={options}
            onChange={handleSelectChange}
            value={selected}
          />
        </Stack.Item>
        <Stack.Item fill>
          <Button 
            fullWidth 
            onClick={() => fetchOrdersWithJourney()}
            loading={loading}
          >Fetch Orders with Journey</Button>
        </Stack.Item>
        <Stack.Item>
          <Tooltip 
            content="Download Orders wih Journeys"
            preferredPosition="above"
          >
            <DataExport
              data={ordersWithJourney}
              title="Orders with Journeys"
              loading={loading}
              disabled={Object.keys(chartData).length <= 0}
            />
          </Tooltip>
        </Stack.Item>
      </Stack>
      {loading ?? (
        <Spinner accessibilityLabel="Loading orders" size="large" />
      )}

      {ordersWithJourney.totalForRange > 0 && (
        <div id="table-wrapper" style={{ opacity: loading ? '0.5' : '1' }}>
         <Stack wrap={true} alignment="trailing">
            {donutData && Object.keys(donutData).map((key) => (
              <Stack.Item fill key={key}>
                <Card title={donutData[key].name}>
                  <DonutPieChart data={donutData[key].data} />
                </Card>
              </Stack.Item>
            ))}
          </Stack>
          <br />

          <Stack>
            <Stack.Item fill>
              <Card title="Orders Journey" sectioned>
                <SparkChart 
                  data={chartData}
                  accessibilityLabel="Orders Journey"
                />
              </Card>
            </Stack.Item>
          </Stack>
          <br />

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