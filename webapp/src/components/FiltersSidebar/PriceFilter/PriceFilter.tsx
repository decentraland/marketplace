import { useEffect, useState } from 'react'
import { RangeField, Box } from 'decentraland-ui'
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

  function handlePriceChange(newValue: [string, string]) {
    setValue(newValue);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => onChange(newValue), 500)
  }

  return (
    <Box header="PRICE" collapsible>
      <RangeField onChange={handlePriceChange} value={value} />
    </Box>
  )
}
