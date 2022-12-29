import { useEffect, useState, useCallback, useRef } from 'react'
import { RangeField, Box } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import './PriceFilter.css'

export type PriceFilterProps = {
  minPrice: string
  maxPrice: string
  onChange: (value: [string, string]) => void
}

export const PriceFilter = ({
  onChange,
  minPrice,
  maxPrice
}: PriceFilterProps) => {
  const [value, setValue] = useState<[string, string]>([minPrice, maxPrice])
  const timeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => setValue([minPrice, maxPrice]), [minPrice, maxPrice])

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  const handlePriceChange = useCallback(
    (newValue: [string, string]) => {
      setValue(newValue)
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
      timeout.current = setTimeout(() => onChange(newValue), 500)
    },
    [setValue, onChange]
  )

  return (
    <Box
      header={t('filters.price')}
      className="filters-sidebar-box"
      collapsible
    >
      <RangeField onChange={handlePriceChange} value={value} />
    </Box>
  )
}
