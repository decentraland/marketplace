import { useEffect, useState, useCallback, useRef } from 'react'
import { RangeField, Box, Mana, useMobileMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import './PriceFilter.css'
import { getPriceLabel } from '../../../utils/filters'

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
  const isMobile = useMobileMediaQuery();

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

  const mobileBoxHeader = (
    <div className='mobile-box-header'>
      <span className="box-filter-name">{t('filters.price')}</span>
      <span className='box-filter-value'>{getPriceLabel(minPrice, maxPrice)}</span>
    </div>
  )

  return (
    <Box
      header={isMobile ? mobileBoxHeader : t('filters.price')}
      className="filters-sidebar-box price-filter"
      collapsible
      defaultCollapsed={isMobile}
    >
      <RangeField
        minProps={{ icon: <Mana />, iconPosition: 'left', placeholder: 0 }}
        maxProps={{ icon: <Mana />, iconPosition: 'left', placeholder: 1000 }}
        onChange={handlePriceChange}
        value={value}
      />
    </Box>
  )
}
