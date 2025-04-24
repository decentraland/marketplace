import { useCallback, useMemo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { useTabletAndBelowMediaQuery } from 'decentraland-ui/dist/components/Media'
import { Box, CheckboxProps, Checkbox } from 'decentraland-ui'
import './MoreFilters.css'

export type MoreFiltersProps = {
  isOnSale?: boolean
  onSaleChange: (value: boolean) => void
  defaultCollapsed?: boolean
}

export const MoreFilters = ({ isOnSale, onSaleChange, defaultCollapsed = false }: MoreFiltersProps) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const handleOnSaleChange = useCallback(
    (_, props: CheckboxProps) => {
      onSaleChange(!!props.checked)
    },
    [onSaleChange]
  )

  const filterText = useMemo(() => {
    return isOnSale ? t('nft_filters.for_sale') : t('nft_filters.not_on_sale')
  }, [isOnSale])

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

  return isOnSale !== undefined ? (
    <Box header={header} className="filters-sidebar-box" collapsible defaultCollapsed={defaultCollapsed || isMobileOrTablet}>
      <div className="more-filters-section">
        <Checkbox label={t('nft_filters.on_sale')} toggle checked={isOnSale} onChange={handleOnSaleChange} />
      </div>
    </Box>
  ) : null
}
