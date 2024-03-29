import { useCallback, useRef, useState } from 'react'
import {
  Button,
  LegacyCard,
  DataTable,
  Pagination,
  Select,
  Spinner,
  LegacyStack,
  Text,
  Tooltip,
} from '@shopify/polaris'
import { useAuthDispatch } from '../contexts/Auth'
import { useToastDispatch } from '../contexts/Toast'
import { useDateRangesV2 } from '../contexts/DateRanges'
import { DonutPieChart, ALineChart } from './Charts'
import {
  attributionNew,
  formattedOrder,
  formattedNewOrders,
  newOrder,
  newOrders,
  platformClick,
  sparkChartData,
  donutDataKeys,
  donutDataObject,
  donutDataLineItemData,
} from '../types/Types'
import { DataExport } from '../DataExport'

const formatOrders = (orders: newOrders) => {
  return orders.map((order: newOrder) => [
    order.order_id,
    order.customer_id,
    order.journey?.length || 0,
    order.total_price.toString(),
    order.attribution?.firstClick
      ?.map((click: platformClick) => click.source ?? '')
      .flat()
      .toString()
      .replace(/,/g, '\n'),
    order.attribution?.lastClick
      ?.map((click: platformClick) => click.source ?? '')
      .flat()
      .toString()
      .replace(/,/g, '\n'),
    order.attribution?.lastPlatformClick
      ?.map((click: platformClick) => click.source ?? '')
      .flat()
      .toString()
      .replace(/,/g, '\n'),
  ])
}

const formatChartData = (orders: newOrders) => {
  return [
    {
      data: orders.map((order: newOrder) => ({
        key: order.order_id,
        value: order.journey?.length,
      })),
      name: 'Journey Length',
    },
  ]
}

const formatPriceChartData = (orders: newOrders) => {
  return [
    {
      data: orders.map((order: newOrder) => ({
        key: order.customer_id,
        value: order.total_price,
      })),
      name: 'Order Value',
    },
  ]
}

const formatAverageJourney = (orders: newOrders) => {
  return Math.round(
    orders.reduce((a, c) => {
      return a + c?.journey?.length
    }, 0) / orders.length
  )
}

const formatAveragePrice = (orders: newOrders) => {
  var avg = 0
  orders.map((o) => {
    avg += parseFloat(o.total_price)
  })
  avg = avg / orders.length

  return parseFloat(avg.toFixed(2))
}

const formatSourceString = (string: string) => {
  return string
    .replace(/,/g, '\n')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace('fb', 'FB')
    .replace('tw', 'TW')
    .trim()
}

const formatDonutData = (orders: newOrders) => {
  const rawData: donutDataObject = {
    firstClick: { name: 'First Click', data: [] },
    lastClick: { name: 'Last Click', data: [] },
    // lastPlatformClick: { name: "Last Platform Click", data: [] }
  }

  orders.map((order: newOrder) => {
    return Object.keys(rawData).map((key: string) => {
      let source = order?.attribution[key as keyof attributionNew]
      let sourceString = ''

      if (source && Array.isArray(source) && source[0]?.source) {
        sourceString = formatSourceString(source[0].source)
      }

      const currentVal = rawData[key as donutDataKeys]?.data.find(
        (o: donutDataLineItemData) => {
          return o.name === sourceString
        }
      )

      if (sourceString !== '') {
        let k = rawData[key as donutDataKeys]?.name

        if (!currentVal && k) {
          rawData[key as donutDataKeys]?.data.push({
            data: [
              {
                key: k,
                value: 1,
              },
            ],
            name: sourceString,
          })
        } else if (currentVal) {
          // @ts-ignore
          currentVal.data[0].value += 1
        }
      }
    })
  })

  // sort
  Object.keys(rawData).map((key: string) => {
    rawData[key as donutDataKeys]?.data.sort((a, b) => {
      // @ts-ignore
      return b.data[0].value - a.data[0].value
    })
  })

  return rawData
}

export const FetchOrdersWithJourneysV2: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [ordersWithJourney, setOrdersWithJourney] = useState({} as newOrders)
  const [sortedOrders, setSortedOrders] = useState([] as formattedNewOrders)

  const [chartData, setChartData] = useState([] as sparkChartData)
  const [donutData, setDonutData] = useState({} as donutDataObject)
  const [priceChartData, setPriceChartData] = useState([] as sparkChartData)

  const [averageJourney, setAverageJourney] = useState(0)
  const [averagePrice, setAveragePrice] = useState(0)

  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 100
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = Math.abs(indexOfLastOrder - ordersPerPage)
  const nPages = Math.ceil(sortedOrders.length / ordersPerPage)
  const currentOrders =
    (sortedOrders &&
      sortedOrders.length > 100 &&
      sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder)) ||
    sortedOrders

  const authDispatch = useAuthDispatch()
  const toastDispatch = useToastDispatch()

  const rawDateRanges = useDateRangesV2()
  const dateRanges = rawDateRanges.map((option) => ({
    label: option.label,
    value: option.value.id,
  }))
  const [selected, setSelected] = useState(dateRanges[0].value)
  const [options] = useState(dateRanges)

  const sortOrders = (
    orders: formattedNewOrders,
    index: number,
    direction: string
  ) => {
    return [...orders].sort((rowA: formattedOrder, rowB: formattedOrder) => {
      const amountA = parseFloat(rowA[index].toString())
      const amountB = parseFloat(rowB[index].toString())

      return direction === 'descending' ? amountB - amountA : amountA - amountB
    })
  }

  const handleSort = useCallback(
    (index: number, direction: string) =>
      setSortedOrders(sortOrders(sortedOrders, index, direction)),
    [sortedOrders]
  )

  const handleSelectChange = (val: string) => {
    setSelected(val)
    setOrdersWithJourney({} as newOrders)
    setSortedOrders([] as formattedNewOrders)
    setChartData([] as sparkChartData)
    setPriceChartData([] as sparkChartData)
    setDonutData({} as donutDataObject)
    setAverageJourney(0)
    setAveragePrice(0)
    setCurrentPage(1)
  }

  const fetchOrdersWithJourney = async (): Promise<void> => {
    setLoading(true)
    const selectedRange = rawDateRanges.find(
      (range) => range.value.id == selected
    )
    if (selectedRange) {
      const orderJourneys = await fetch('/get-orders-with-journeys-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: selectedRange.value.start,
          endDate: selectedRange.value.end,
        }),
      }).then((res) => res.json())

      if (orderJourneys.message?.length > 0 && orderJourneys.code !== 401) {
        authDispatch!({ type: 'error', message: orderJourneys.message })
        toastDispatch!({ type: 'error', message: orderJourneys.message })
      } else if (orderJourneys.code && orderJourneys.code !== 200) {
        authDispatch!({ type: 'expired', message: orderJourneys.message })
        toastDispatch!({ type: 'error', message: orderJourneys.message })
      } else {
        authDispatch!({ type: 'success' })
        setOrdersWithJourney(orderJourneys)
        setSortedOrders(formatOrders(orderJourneys))
        setAverageJourney(formatAverageJourney(orderJourneys))
        setAveragePrice(formatAveragePrice(orderJourneys))
        setChartData(formatChartData(orderJourneys))
        setPriceChartData(formatPriceChartData(orderJourneys))
        setDonutData(formatDonutData(orderJourneys))
        setCurrentPage(1)
      }
    }
    setLoading(false)
  }

  const initialized = useRef(false)
  if (!initialized.current) {
    fetchOrdersWithJourney()
    initialized.current = true
  }

  return (
    <LegacyStack vertical>
      <Text variant="bodyMd" as="p">
        Below will make a <code>POST</code> request to the API endpoint{' '}
        <code>
          https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys-v2
        </code>
      </Text>
      <LegacyStack wrap={true} alignment="trailing">
        <LegacyStack.Item fill>
          <Select
            label="Date range"
            options={options as []}
            onChange={handleSelectChange}
            value={selected}
          />
        </LegacyStack.Item>
        <LegacyStack.Item fill>
          <Button
            fullWidth
            onClick={() => fetchOrdersWithJourney()}
            loading={loading}
          >
            Fetch Orders with Journey
          </Button>
        </LegacyStack.Item>
        <LegacyStack.Item>
          <Tooltip
            content="Download Orders wih Journeys"
            preferredPosition="above"
          >
            <DataExport
              data={ordersWithJourney}
              title="Orders with Journeys"
              disabled={Object.keys(chartData).length <= 0}
            />
          </Tooltip>
        </LegacyStack.Item>
      </LegacyStack>
      {loading ?? <Spinner accessibilityLabel="Loading orders" size="large" />}

      {ordersWithJourney.length > 0 && (
        <div id="table-wrapper" style={{ opacity: loading ? '0.5' : '1' }}>
          <LegacyStack wrap={true} alignment="trailing">
            {donutData &&
              Object.keys(donutData).map((key) => (
                <LegacyStack.Item fill key={key}>
                  <LegacyCard title={donutData[key as donutDataKeys]?.name}>
                    <DonutPieChart
                      data={donutData[key as donutDataKeys]?.data ?? []}
                    />
                  </LegacyCard>
                </LegacyStack.Item>
              ))}
          </LegacyStack>
          <br />

          <LegacyStack>
            <LegacyStack.Item fill>
              <LegacyCard title="Journey Length" sectioned>
                <ALineChart
                  data={chartData}
                  annotations={[
                    {
                      axis: 'y',
                      label: `Average: ${averageJourney}`,
                      startKey: averageJourney,
                    },
                  ]}
                />
              </LegacyCard>
            </LegacyStack.Item>

            <LegacyStack.Item fill>
              <LegacyCard title="Total Price" sectioned>
                <ALineChart
                  data={priceChartData}
                  annotations={[
                    {
                      axis: 'y',
                      label: `Average Price: ${averagePrice}`,
                      startKey: averagePrice,
                    },
                  ]}
                />
              </LegacyCard>
            </LegacyStack.Item>
          </LegacyStack>
          <br />

          <LegacyStack distribution="fill">
            <Text variant="headingSm" as="p">
              {ordersWithJourney.length} total orders
            </Text>
            <Text alignment="end" variant="headingSm" as="p">
              Page {currentPage}
              {nPages > 1 && <span> of {nPages}</span>}
            </Text>
          </LegacyStack>
          <LegacyStack>
            <DataTable
              stickyHeader={true}
              columnContentTypes={[
                'text',
                'text',
                'text',
                'text',
                'text',
                'text',
                'text',
                'text',
              ]}
              headings={[
                'Order ID',
                'Customer ID',
                'Journey Length',
                'Price',
                'First Click',
                'Last Click',
                'Last Platform Click',
              ]}
              rows={currentOrders}
              onSort={handleSort}
              hasZebraStripingOnData
              sortable={[false, false, true, true, false, false]}
            />
          </LegacyStack>
          {nPages > 1 && (
            <LegacyStack distribution="center">
              <Pagination
                hasPrevious={!!(!loading && currentPage > 1)}
                previousTooltip={`Page ${currentPage}`}
                onPrevious={() => {
                  setCurrentPage(currentPage - 1 || 0)
                  window.scrollTo({
                    top: document.getElementById('table-wrapper')?.offsetTop,
                  })
                }}
                hasNext={!loading && currentOrders.length >= 100}
                nextTooltip={`Page ${currentPage + 1}`}
                onNext={() => {
                  setCurrentPage(currentPage + 1)
                  window.scrollTo({
                    top: document.getElementById('table-wrapper')?.offsetTop,
                  })
                }}
              />
            </LegacyStack>
          )}
        </div>
      )}
    </LegacyStack>
  )
}
