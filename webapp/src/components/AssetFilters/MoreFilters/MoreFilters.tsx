import { useCallback, useMemo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { useTabletAndBelowMediaQuery } from 'decentraland-ui/dist/components/Media'
import { Box, CheckboxProps, Checkbox } from 'decentraland-ui'
import './MoreFilters.css'

export type MoreFiltersProps = {
  onlyOnSale?: boolean
  onSaleChange: (value: boolean) => void
  defaultCollapsed?: boolean
}

export const MoreFilters = ({ onlyOnSale, onSaleChange, defaultCollapsed = false }: MoreFiltersProps) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const handleOnSaleChange = useCallback(
    (_: React.FormEvent<HTMLInputElement>, props: CheckboxProps) => {
      onSaleChange(!!props.checked)
    },
    [onSaleChange]
  )

  // The box holds the opt-in "On Sale" toggle, so the collapsed header reflects its state: the filter name when on, nothing when off.
  const filterText = useMemo(() => {
    return onlyOnSale ? t('nft_filters.on_sale') : ''
  }, [onlyOnSale])

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('nft_filters.more_filters')}</span>
          <span className="box-filter-value">{filterText}</span>
        </div>
      ) : (
        t('nft_filters.more_filters')
      ),
    [filterText, isMobileOrTablet]
  )

  return onlyOnSale !== undefined ? (
    <Box header={header} className="filters-sidebar-box" collapsible defaultCollapsed={defaultCollapsed || isMobileOrTablet}>
      <div className="more-filters-section">
        <Checkbox label={t('nft_filters.on_sale')} toggle checked={onlyOnSale} onChange={handleOnSaleChange} />
      </div>
    </Box>
  ) : null
}
