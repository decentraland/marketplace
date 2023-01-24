import { useCallback, useMemo } from 'react'
import {
  Box,
  CheckboxProps,
  Checkbox,
  useTabletAndBelowMediaQuery
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFTCategory } from '@dcl/schemas'
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

  const handleOnlySmartChange = useCallback(
    (_, props: CheckboxProps) => {
      onOnlySmartChange(!!props.checked)
    },
    [onOnlySmartChange]
  )

  const handleOnSaleChange = useCallback(
    (_, props: CheckboxProps) => {
      onSaleChange(!!props.checked)
    },
    [onSaleChange]
  )

  const filterText = useMemo(() => {
    const values: string[] = []
    values.push(
      isOnSale ? t('nft_filters.for_sale') : t('nft_filters.not_on_sale')
    )
    if (isOnlySmart) {
      values.push(t('nft_filters.only_smart'))
    }
    return values.join(', ')
  }, [isOnSale, isOnlySmart])

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">
            {t('nft_filters.more_filters')}
          </span>
          <span className="box-filter-value">{filterText}</span>
        </div>
      ) : (
        t('nft_filters.more_filters')
      ),
    [filterText, isMobileOrTablet]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box"
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <div className="more-filters-section">
        <Checkbox
          label="On sale"
          toggle
          checked={isOnSale} 
          onChange={handleOnSaleChange}
        />
        {isWearableCategory && (
          <Checkbox
            label="Only smart"
            toggle
            checked={isOnlySmart}
            onChange={handleOnlySmartChange}
          />
        )}
      </div>
    </Box>
  )
}
