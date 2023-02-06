import { useCallback, useState } from 'react'
import { Button, Popover, ActionList } from '@shopify/polaris'
import { ArrowDownMinor } from '@shopify/polaris-icons'
import { dataExportProps } from './types/Types'

// @ts-ignore
import { Parser } from '@json2csv/plainjs'

export const DataExport: React.FC<dataExportProps> = (
  props: dataExportProps
) => {
  const { data, title, disabled } = props
  const [loading, setLoading] = useState(false)

  const [popoverActive, setPopoverActive] = useState(false)
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  )

  const exportCSVFile = (items: any, title: string) => {
    const parser = new Parser()
    const csv = parser.parse(items)
    const exportedFilename =
      title.toLowerCase().replace(/ /g, '_') + '.csv' || 'export.csv'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    let link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', exportedFilename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadCSV = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
    exportCSVFile(data, title)
  }

  const exportJSONFile = (items: any, title: string) => {
    // Convert Object to JSON
    const jsonObject = JSON.stringify(items)
    const exportedFilename =
      title.toLowerCase().replace(/ /g, '_') + '.json' || 'export.json'
    const blob = new Blob([jsonObject], {
      type: 'application/json;charset=utf-8;',
    })
    let link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', exportedFilename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadJSON = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
    exportJSONFile(data, title)
  }

  const activator = (
    <Button
      loading={loading}
      icon={ArrowDownMinor}
      disabled={disabled}
      onClick={togglePopoverActive}
    />
  )

  return (
    <>
      <Popover
        active={popoverActive}
        activator={activator}
        autofocusTarget="first-node"
        onClose={togglePopoverActive}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            { content: 'CSV', onAction: downloadCSV },
            { content: 'JSON', onAction: downloadJSON },
          ]}
        />
      </Popover>
    </>
  )
}
