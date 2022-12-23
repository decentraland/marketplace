import { useEffect, useState, useCallback } from 'react'
import { RangeField, Box } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import './PriceFilter.css'

export type PriceFilterProps = {
  minPrice: string,
  maxPrice: string,
  onChange: (value: [string, string]) => void
}

let timeout: NodeJS.Timeout;

export const PriceFilter = ({ onChange, minPrice, maxPrice }: PriceFilterProps) => {
  const [value, setValue] = useState<[string, string]>([minPrice, maxPrice])

  useEffect(() => setValue([minPrice, maxPrice]), [minPrice, maxPrice])

  useEffect(() => {
    return () => clearTimeout(timeout)
  }, [])

  const handlePriceChange = useCallback((newValue: [string, string]) => {
    setValue(newValue);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => onChange(newValue), 500)
  }, [setValue, onChange])

  return (
    <Box header={t('filters.price')} collapsible>
      <RangeField onChange={handlePriceChange} value={value} />
    </Box>
  )
}
