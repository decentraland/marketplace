import { useCallback, useMemo } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { useTabletAndBelowMediaQuery } from 'decentraland-ui/dist/components/Media'
import { Box, CheckboxProps, Checkbox, SmartWearableFilter } from 'decentraland-ui'
import './MoreFilters.css'

export type MoreFiltersProps = {
  isOnlySmart?: boolean
  isOnSale?: boolean
  category?: NFTCategory
  onOnlySmartChange: (value: boolean) => void
  onSaleChange: (value: boolean) => void
  defaultCollapsed?: boolean
}

export const MoreFilters = ({
  isOnlySmart,
  isOnSale,
  category,
  onOnlySmartChange,
  onSaleChange,
  defaultCollapsed = false
}: MoreFiltersProps) => {
  const isWearableCategory = category === NFTCategory.WEARABLE
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const showOnlySmartFilter = isWearableCategory && isMobileOrTablet

  const handleOnSaleChange = useCallback(
    (_, props: CheckboxProps) => {
      onSaleChange(!!props.checked)
    },
    [onSaleChange]
  )

  const filterText = useMemo(() => {
    const values: string[] = []
    values.push(isOnSale ? t('nft_filters.for_sale') : t('nft_filters.not_on_sale'))
    if (isOnlySmart && showOnlySmartFilter) {
      values.push(t('nft_filters.only_smart.selected'))
    }
    return values.join(', ')
  }, [isOnSale, isOnlySmart, showOnlySmartFilter])

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

  return isOnSale !== undefined || showOnlySmartFilter ? (
    <Box header={header} className="filters-sidebar-box" collapsible defaultCollapsed={defaultCollapsed || isMobileOrTablet}>
      <div className="more-filters-section">
        {isOnSale !== undefined ? (
          <Checkbox label={t('nft_filters.on_sale')} toggle checked={isOnSale} onChange={handleOnSaleChange} />
        ) : null}
        {showOnlySmartFilter && (
          <SmartWearableFilter data-testid="only-smart-filter" isOnlySmart={isOnlySmart} onChange={onOnlySmartChange} />
        )}
      </div>
    </Box>
  ) : null
}
