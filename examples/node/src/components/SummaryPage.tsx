import { useState, useEffect, Fragment } from 'react';
import { Badge, Button, Card, Text, Select, Stack } from '@shopify/polaris';
import { useSummaryDateRanges } from '../contexts/DateRanges';
import { SummaryMetrics, SummaryMetricIdsTypes, ServicesIds } from '../SummaryData'
import { SummaryPageResponse, DictatedData, formattedDictatedService, IServiceMap, ServiceMap } from '../Types'
import SourceIcons from './SourceIcons'

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

    return {
      ...currentMetric,
      source: currentMetric.services[0] || currentMetric.icon,
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
      </Stack>
      <br />

      {Object.keys(dictatedData).map((g: string) => {
        const group = dictatedData[g as IServiceMap] as DictatedData[IServiceMap]
        const filteredGroup = group.filter((item) => item.value !== 0 && item.percentChange)
        
        return filteredGroup.length > 0 && (
          <Card key={g} sectioned>
            <div className="capitalize flex-text">
              <Text variant="headingXl" as="h3"><SourceIcons source={g as IServiceMap} /> {ServiceMap[g as IServiceMap]}</Text>
            </div>
            <br/>
            <Stack wrap={true} spacing="loose" distribution="fill">
              {group.map((item) => {
                const upDown = toNumber(item.percentChange)

                return item.value !== 0 && item.percentChange && (
                  <Card key={item.id} sectioned>
                    <Text variant="bodyMd" as="p">
                      <strong>{item.title}</strong>
                      <br/>
                      <Badge size="small" status={upDown === 0 ? undefined : upDown > 0 ? 'success' : 'critical'}>
                        {upDown === 0 ? '-' : upDown > 0 ? '↑' : '↓'}
                      </Badge>
                      &nbsp;
                      <Text variant="bodySm" as="span">{formatNumber(item.percentChange)}%</Text>
                    </Text>
                    <Text variant="headingXl" as='h1'>{formatValue(item)}</Text>
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