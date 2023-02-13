import { useState, useRef, Fragment } from 'react'
import RenderIfVisible from 'react-render-if-visible'
import {
  Badge,
  Button,
  Card,
  Icon,
  Text,
  Tooltip,
  Select,
  Stack,
} from '@shopify/polaris'
import { QuestionMarkInverseMajor } from '@shopify/polaris-icons'
import { useSummaryDateRanges } from '../contexts/DateRanges'
import { useAuthDispatch } from '../contexts/Auth'
import { useToastDispatch } from '../contexts/Toast'
import {
  DictatedData,
  formattedDictatedService,
  IServiceMap,
  ServiceMap,
} from '../types/Types'
import SourceIcons from './SourceIcons'
import { SparkChart } from './Charts'
import { DataExport } from '../DataExport'

// @ts-ignore
const groupByKey = (list, key) =>
  list.reduce(
    // @ts-ignore
    (hash, obj) => ({
      ...hash,
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    }),
    {}
  )

const groupData = (data: any) => {
  data.map((item: any) => {
    item.service = (item.services?.length > 0 && item.services[0])
      .toString()
      .toLowerCase()
    ;['current', 'previous'].map((period: string) => {
      item.charts[period] = item.charts[period]?.map((metric: any) => ({
        key: metric.x,
        value: metric.y,
      }))
    })
  })

  return groupByKey(data, 'service')
}

export const SummaryPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [dictatedData, setDictatedData] = useState({} as DictatedData)

  const authDispatch = useAuthDispatch()
  const toastDispatch = useToastDispatch()

  const rawDateRanges = useSummaryDateRanges()
  const dateRanges = rawDateRanges.map((option) => ({
    label: option.label,
    value: option.value.id,
  }))
  const [selected, setSelected] = useState(dateRanges[0].value)
  const [options] = useState(dateRanges)
  const handleSelectChange = (val: string) => {
    setSelected(val)
    setDictatedData({} as DictatedData)
  }

  const fetchSummaryPage = async () => {
    setLoading(true)
    const selectedRange = rawDateRanges.find(
      (range) => range.value.id == selected
    )

    if (selectedRange) {
      const bodyData = {
        period: {
          start: selectedRange.value.start,
          end: selectedRange.value.end,
        },
        todayHour: selectedRange.value.todayHour || 1,
      }

      const data = await fetch('/get-summary-page-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      })
        .then((res) => res.json())
        .catch(() => setLoading(false))

      if (data.error) {
        authDispatch!({ type: 'error', message: data.error })
        toastDispatch!({ type: 'error', message: data.error })
      } else if (data.message && data.message !== 200) {
        authDispatch!({ type: 'expired', message: data.message })
        toastDispatch!({ type: 'error', message: data.message })
      } else {
        authDispatch!({ type: 'success' })
        setDictatedData(groupData(data.metrics))
      }
    }

    setLoading(false)
  }

  const initialized = useRef(false)
  if (!initialized.current) {
    fetchSummaryPage()
    initialized.current = true
  }

  const toNumber = (num: number | string) =>
    typeof num == 'number' ? num : parseFloat(num)
  const toCurrency = (num: string) =>
    parseFloat(num)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      .replace('.00', '')

  const formatNumber = (num: number | string) => {
    return toNumber(num).toFixed(2).replace('.00', '')
  }

  const formatValue = (item: formattedDictatedService) => {
    return `${
      item.type === 'currency'
        ? `${toCurrency(formatNumber(item.values.current))}`
        : formatNumber(item.values.current)
    }${item.type === 'percent' ? '%' : ''}`
  }

  const formatSparkChartData = (item: formattedDictatedService) => {
    return [
      { data: item.charts.current },
      { isComparison: true, data: item.charts.previous },
    ]
  }

  return (
    <Fragment>
      <Stack wrap={true} alignment="trailing">
        <Text variant="bodyMd" as="p">
          Below will make a <code>POST</code> request to the API endpoint{' '}
          <code>https://api.triplewhale.com/api/v2/summary-page/get-data</code>
        </Text>
        <Stack.Item fill>
          <Select
            label="Date range"
            options={options as []}
            onChange={handleSelectChange}
            value={selected}
          />
        </Stack.Item>
        <Stack.Item fill>
          <Button
            fullWidth
            onClick={() => fetchSummaryPage()}
            loading={loading}
          >
            Fetch Summary Page Data
          </Button>
        </Stack.Item>
        <Stack.Item>
          <Tooltip content="Download Metrics" preferredPosition="above">
            <DataExport
              data={dictatedData}
              title="Summary Page"
              disabled={Object.keys(dictatedData).length <= 0}
            />
          </Tooltip>
        </Stack.Item>
      </Stack>
      <br />

      {Object.keys(dictatedData).map((g: string) => {
        const group = dictatedData[
          g as IServiceMap
        ] as DictatedData[IServiceMap]
        const filteredGroup = group.filter(
          (item) => item.values?.current !== 0 && item.delta
        )
        const plainTextService = ServiceMap[g as IServiceMap]

        return (
          filteredGroup.length > 0 && (
            <Card key={g} sectioned>
              <div className="capitalize flex-text">
                <Text variant="headingXl" as="h3">
                  <SourceIcons source={g as IServiceMap} /> {plainTextService}
                </Text>
              </div>
              <br />
              <Stack wrap={true} spacing="loose" distribution="fillEvenly">
                {group.map((item) => {
                  const delta = toNumber(item.delta)
                  const deltaIsPositive =
                    (delta > 0 &&
                      (item.positiveComparison > 0 ||
                        !item.positiveComparison)) ||
                    (delta < 0 && item.positiveComparison < 0)

                  return (
                    item.values?.current !== 0 &&
                    item.delta && (
                      <Card key={item.id} sectioned>
                        <Text variant="bodyMd" as="p">
                          <span className="flex-text">
                            <strong>
                              {item.title}
                              {item.tip && (
                                <Tooltip content={item.tip}>
                                  <Icon
                                    source={QuestionMarkInverseMajor}
                                    color="subdued"
                                  />
                                </Tooltip>
                              )}
                              <br />
                            </strong>
                          </span>
                          <Badge
                            size="small"
                            status={deltaIsPositive ? 'success' : 'critical'}
                          >
                            {delta === 0 ? '-' : delta > 0 ? '↑' : '↓'}
                          </Badge>
                          &nbsp;
                          <Text variant="bodySm" as="span">
                            {formatNumber(item.delta)}%
                          </Text>
                        </Text>
                        <Text variant="headingXl" as="h1">
                          {formatValue(item)}
                        </Text>
                        {item.charts?.current?.length > 0 && (
                          <RenderIfVisible
                            defaultHeight={60}
                            stayRendered={true}
                          >
                            <SparkChart
                              accessibilityLabel={plainTextService}
                              data={formatSparkChartData(item)}
                            />
                          </RenderIfVisible>
                        )}
                      </Card>
                    )
                  )
                })}
              </Stack>
            </Card>
          )
        )
      })}
    </Fragment>
  )
}
