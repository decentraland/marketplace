import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { RangeField, Box, Mana, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getPriceLabel } from '../../../utils/filters'
import './PriceFilter.css'

export type PriceFilterProps = {
  minPrice: string
  maxPrice: string
  network?: Network
  onChange: (value: [string, string]) => void
}

export const PriceFilter = ({
  onChange,
  minPrice,
  maxPrice,
  network = Network.ETHEREUM
}: PriceFilterProps) => {
  const [value, setValue] = useState<[string, string]>([minPrice, maxPrice])
  const timeout = useRef<NodeJS.Timeout | null>(null)
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

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

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('filters.price')}</span>
          <span className="box-filter-value">
            {getPriceLabel(minPrice, maxPrice, network)}
          </span>
        </div>
      ) : (
        t('filters.price')
      ),
    [minPrice, maxPrice, network, isMobileOrTablet]
  )

  const showMaxErrorPrice = useMemo(() => {
    return value[0] && value[1] && Number(value[1]) <= Number(value[0])
  }, [value])

  return (
    <Box
      header={header}
      className="filters-sidebar-box price-filter"
      collapsible
      defaultCollapsed={isMobileOrTablet}
    >
      <RangeField
        minProps={{
          icon: <Mana network={network} />,
          iconPosition: 'left',
          placeholder: 0
        }}
        maxProps={{
          icon: <Mana network={network} />,
          iconPosition: 'left',
          placeholder: 1000
        }}
        onChange={handlePriceChange}
        value={value}
      />
      {showMaxErrorPrice ? (
        <span className="price-filter-error">
          {t('filters.price_min_greater_max')}
        </span>
      ) : null}
    </Box>
  )
}
