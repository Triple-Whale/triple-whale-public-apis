import { useState, useEffect, Fragment } from 'react';
import RenderIfVisible from 'react-render-if-visible';
import { Badge, Button, Card, Icon, Text, Tooltip, Select, Stack } from '@shopify/polaris';
import { QuestionMarkInverseMajor } from '@shopify/polaris-icons'
import { useSummaryDateRanges } from '../contexts/DateRanges';
import { SummaryPageResponse, DictatedData, formattedDictatedService, IServiceMap, ServiceMap } from '../types/Types'
import SourceIcons from './SourceIcons'
import { SparkChart } from './Charts';
import { DataExport } from '../DataExport';

// @ts-ignore
const groupByKey = (list, key) => list.reduce((hash, obj) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {})

const groupData = (data: any) => {
  data.map((item: any) => {
    item.service = item.icon || item.services?.length > 0 && item.services[0];
    ['current', 'previous'].map((period: string) => {
      item.charts[period] = item.charts[period]?.map((metric: any) => ({
        key: metric.x,
        value: metric.y
      }))
    })
  })

  return groupByKey(data, 'service')
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
      const { metrics } = await fetch('/get-summary-page-data').then(res => res.json())
      setData(metrics);
      setDictatedData(groupData(metrics))
    }
  
    fetchData().catch(console.error);
  }, [])

  const toNumber = (num: number | string) => typeof num == 'number' ? num : parseFloat(num)  
  const toCurrency = (num: string) => parseFloat(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '')

  const formatNumber = (num: number | string) => { 
    return toNumber(num).toFixed(2).replace('.00', '') 
  }

  const formatValue = (item: formattedDictatedService) => {
    return `${item.type === 'currency' ? `${toCurrency(formatNumber(item.values.current))}` : formatNumber(item.values.current)}${item.type === 'percent' ? '%' : ''}`
  }

  const formatSparkChartData = (item: formattedDictatedService) => {
    console.log([
      { data: item.charts.current },
      { isComparison: true, data: item.charts.previous }
    ])
    return [
      { data: item.charts.current },
      { isComparison: true, data: item.charts.previous }
    ]
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
        const filteredGroup = group.filter((item) => item.values?.current !== 0 && item.delta)
        const plainTextService = ServiceMap[g as IServiceMap]
        
        return filteredGroup.length > 0 && (
          <Card key={g} sectioned>
            <div className="capitalize flex-text">
              <Text variant="headingXl" as="h3"><SourceIcons source={g as IServiceMap} /> {plainTextService}</Text>
            </div>
            <br/>
            <Stack wrap={true} spacing="loose" distribution="fillEvenly">
              {group.map((item) => {
                const delta = toNumber(item.delta)
                const deltaIsPositive = (delta > 0 && (item.positiveComparison > 0 || !item.positiveComparison)) 
                  || (delta < 0 && item.positiveComparison < 0);

                return item.values?.current !== 0 && item.delta && (
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
                      <Badge size="small" status={deltaIsPositive ? 'success' : 'critical'}>
                        {delta === 0 ? '-' : delta > 0 ? '↑' : '↓'}
                      </Badge>
                      &nbsp;
                      <Text variant="bodySm" as="span">{formatNumber(item.delta)}%</Text>
                    </Text>
                    <Text variant="headingXl" as='h1'>{formatValue(item)}</Text>
                    {item.charts?.current?.length > 0 && (
                      <RenderIfVisible defaultHeight={60} stayRendered={true}>
                        <SparkChart accessibilityLabel={plainTextService} data={formatSparkChartData(item)} />
                      </RenderIfVisible>
                    )}
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