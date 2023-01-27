import { useState, useEffect, Fragment } from 'react';
import { Badge, Button, Card, Text, Select, Stack } from '@shopify/polaris';
import { useSummaryDateRanges } from '../contexts/DateRanges';
import { SummaryMetrics, SummaryMetricIdsTypes, ServicesIds } from '../SummaryData'
import { SummaryPageResponse, DictatedData, formattedDictatedService } from '../Types'
// @ts-ignore
const groupByKey = (list, key) => list.reduce((hash, obj) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {})

const dictateData = (data: SummaryPageResponse) => {
  const flatDictatedData = Object.keys(SummaryMetrics).flatMap((metric) => {
    const currentMetric = SummaryMetrics[metric as SummaryMetricIdsTypes];
    const value = data.comparisons[0][currentMetric.metricId] & (
      data.comparisons[0][currentMetric.metricId].web?.revenue
      || data.comparisons[0][currentMetric.metricId]
    )
    const percentChange = data.calculatedStats[0][currentMetric.metricId] && (
      data.calculatedStats[0][currentMetric.metricId].web?.revenue
      || data.calculatedStats[0][currentMetric.metricId]
    )

    return {
      ...currentMetric,
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

  const formatNumber = (num: number | string) => { 
    return toNumber(num).toFixed(2).replace('.00', '') 
  }

  const formatValue = (item: formattedDictatedService) => {
    return `${item.type === 'currency' ? '$' : ''}${formatNumber(item.value)}${item.type === 'percent' ? '%' : ''}`
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
        const group = dictatedData[g as keyof ServicesIds] as DictatedData[keyof ServicesIds]
        const filteredGroup = group.filter((item) => item.value !== 0)
        
        return filteredGroup.length > 0 && (
          <Card key={g} sectioned>
            <div className="capitalize">
              <Text variant="headingXl" as="h3">{g}</Text>
            </div>
            <br/>
            <Stack wrap={true} spacing="loose" distribution="fill">
              {group.map((item) => {
                const val = toNumber(item.value)
                return item.value !== 0 && (
                  <Card key={item.id} sectioned>
                    <Text variant="bodyMd" as="p">
                      <strong>{item.title}</strong>
                      <br/>
                      <Badge status={val > 0 ? 'success' : 'critical'}>{val > 0 ? '↑' : '↓'}</Badge>
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