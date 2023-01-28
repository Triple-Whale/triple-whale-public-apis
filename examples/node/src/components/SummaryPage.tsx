import { useState, useEffect, Fragment } from 'react';
import { Badge, Button, Card, Icon, Text, Tooltip, Select, Stack } from '@shopify/polaris';
import { QuestionMarkInverseMajor } from '@shopify/polaris-icons'
import { useSummaryDateRanges } from '../contexts/DateRanges';
import { SummaryMetrics, SummaryMetricIdsTypes, ServicesIds } from '../SummaryData'
import { SummaryPageResponse, DictatedData, formattedDictatedService, IServiceMap, ServiceMap } from '../Types'
import SourceIcons from './SourceIcons'
import { SparkChart } from './Charts';
import { DataExport } from '../DataExport';

// @ts-ignore
const groupByKey = (list, key) => list.reduce((hash, obj) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {})

const dictateData = (data: SummaryPageResponse) => {
  const flatDictatedData = Object.keys(SummaryMetrics).flatMap((metric) => {
    const currentMetric = SummaryMetrics[metric as SummaryMetricIdsTypes];
    const percentChange = data.comparisons[0][currentMetric.metricId] & (
      data.comparisons[0][currentMetric.metricId].web?.revenue
      || data.comparisons[0][currentMetric.metricId]
    )
    const value = data.calculatedStats[0][currentMetric.metricId] && (
      data.calculatedStats[0][currentMetric.metricId].web?.revenue
      || data.calculatedStats[0][currentMetric.metricId]
    )

    // -----------------------------------------------
    // WIP!
    // GUESS which stat corresponds
    // this logic only covers a few scenarios, but it's a start
    // -----------------------------------------------
    // WHY?
    // There are many reducers/transformers that are leveraged 
    // in order to format the data for charts
    // -----------------------------------------------
    let stats: any = []
    const service = currentMetric.services[0]
    if(data.previousPeriodRawStats) {
    const metric = currentMetric.metricId
    const newStatsService = data.previousPeriodRawStats.newStats[service]
      stats = data.previousPeriodRawStats.stats.flatMap((day: any) => {
        return Object.keys(day.hours).flatMap((hour: any) => {
          if(!!day.hours[hour][metric]) {
            return {
              key: hour,
              value: day.hours[hour][metric],
              date: day.end
            }
          }
        })
      }).filter(Boolean)

      if(newStatsService) { 
        newStatsService.flatMap((day: any) => {
          const metricContainsKey = Object.keys(day.hours[0]).find(key => metric.includes(key.replace(service, ''))) ?? []
          if(metricContainsKey.length > 0) {
            const currMetric = metricContainsKey[0]
            stats = Object.keys(day.hours).flatMap((hour: any) => {
              if(!!day.hours[hour][currMetric]) {
                return {
                  key: hour,
                  value: day.hours[hour][currMetric],
                  date: day.end
                }
              }
            }).filter(Boolean)
          }
        })
      }
    }

    return {
      ...currentMetric,
      source: currentMetric.services[0] || currentMetric.icon,
      stats,
      value,
      percentChange
    };
  })

  return groupByKey(flatDictatedData, 'icon')
}

export const SummaryPage: React.FC = () => {
  const [data, setData] = useState({} as SummaryPageResponse);
  const [dictatedData, setDictatedData] = useState({} as DictatedData)

  const rawDateRanges = useSummaryDateRanges()
  const dateRanges = rawDateRanges.map(option => ({
    label: option.label,
    value: option.value.id
  }))
  const [selected, setSelected] = useState(dateRanges[0].value);
  const [options] = useState(dateRanges)
  const handleSelectChange = (val: string) => {
    setSelected(val)
  }

  // @TODO - fetch data from server
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/get-summary-page-data').then(res => res.json())
      setData(data);
      setDictatedData(dictateData(data))
    }
  
    fetchData().catch(console.error);
  }, [])

  const toNumber = (num: number | string) => typeof num == 'number' ? num : parseFloat(num)  
  const toCurrency = (num: string) => parseFloat(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '')

  const formatNumber = (num: number | string) => { 
    return toNumber(num).toFixed(2).replace('.00', '') 
  }

  const formatValue = (item: formattedDictatedService) => {
    return `${item.type === 'currency' ? `${toCurrency(formatNumber(item.value))}` : formatNumber(item.value)}${item.type === 'percent' ? '%' : ''}`
  }

  return (
    <Fragment>
      <Stack wrap={true} alignment="trailing">
        <Stack.Item fill>
          <Select
            label="Date range"
            options={options as []}
            onChange={handleSelectChange}
            value={selected}
          />
        </Stack.Item>
        <Stack.Item fill>
          <Button fullWidth onClick={() => console.log('clicked')}>Fetch Summary Page Data</Button>
        </Stack.Item>
        <Stack.Item>
          <Tooltip 
            content="Download Metrics"
            preferredPosition="above"
          >
            <DataExport
              data={dictatedData}
              title="Dictated Summary Page"
              disabled={Object.keys(dictatedData).length <= 0}
            />
          </Tooltip>
        </Stack.Item>
      </Stack>
      <br />

      {Object.keys(dictatedData).map((g: string) => {
        const group = dictatedData[g as IServiceMap] as DictatedData[IServiceMap]
        const filteredGroup = group.filter((item) => item.value !== 0 && item.percentChange)
        const plainTextService = ServiceMap[g as IServiceMap]
        
        return filteredGroup.length > 0 && (
          <Card key={g} sectioned>
            <div className="capitalize flex-text">
              <Text variant="headingXl" as="h3"><SourceIcons source={g as IServiceMap} /> {plainTextService}</Text>
            </div>
            <br/>
            <Stack wrap={true} spacing="loose" distribution="fill">
              {group.map((item) => {
                const upDown = toNumber(item.percentChange)

                return item.value !== 0 && item.percentChange && (
                  <Card key={item.id} sectioned>
                    <Text variant="bodyMd" as="p">
                      <span className="flex-text">
                        <strong>
                          {item.title}
                          <Tooltip content={item.tip}>
                            <Icon
                              source={QuestionMarkInverseMajor}
                              color="subdued"
                            />
                          </Tooltip>
                          <br />
                        </strong>
                      </span>
                      <Badge size="small" status={upDown === 0 ? undefined : upDown > 0 ? 'success' : 'critical'}>
                        {upDown === 0 ? '-' : upDown > 0 ? '↑' : '↓'}
                      </Badge>
                      &nbsp;
                      <Text variant="bodySm" as="span">{formatNumber(item.percentChange)}%</Text>
                    </Text>
                    <Text variant="headingXl" as='h1'>{formatValue(item)}</Text>
                    {/* {item.stats && item.stats?.length > 0 && (
                      <SparkChart accessibilityLabel={plainTextService} data={[{ data: item.stats }]} />
                    )} */}
                  </Card>
                )
              })}
            </Stack>
          </Card>
        )
      })}
    </Fragment>
  );
}