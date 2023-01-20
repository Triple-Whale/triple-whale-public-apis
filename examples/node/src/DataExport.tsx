import { useCallback, useState } from 'react'
import { Button, Popover, ActionList } from '@shopify/polaris';
import { ArrowDownMinor } from '@shopify/polaris-icons';
import { dataExportProps } from './Types'

export const DataExport: React.FC<any> = (props: dataExportProps) => {
  const { data, title, disabled } = props
  const [loading, setLoading] = useState(false)

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);

  const convertToCSV = (objArray: any) => {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','
        line += array[i][index];
      }
      str += line + '\r\n';
    }

    return str;
  }

  const exportCSVFile = (items: any, title: any) => {
    // Convert Object to JSON
    const jsonObject = JSON.stringify(items)
    const csv = convertToCSV(jsonObject)
    const exportedFilenmae = title.toLowerCase().replace(/ /g, '_') + '.json' || 'export.json'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", exportedFilenmae)
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

  const exportJSONFile = (items: any, title: any) => {
    // Convert Object to JSON
    const jsonObject = JSON.stringify(items)
    const exportedFilenmae = title.toLowerCase().replace(/ /g, '_') + '.json' || 'export.json'
    const blob = new Blob([jsonObject], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", exportedFilenmae)
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
            { content: 'JSON', onAction: downloadJSON }
          ]}
        />
      </Popover>
    </>
  )
}