import { useCallback } from 'react'
import { Box, CheckboxProps, Radio } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFTCategory } from '@dcl/schemas'
import './MoreFilters.css'

export type MoreFiltersProps = {
  isOnlySmart?: boolean
  isOnSale?: boolean
  category?: NFTCategory
  onOnlySmartChange: (value: boolean) => void
  onSaleChange: (value: boolean) => void
}

export const MoreFilters = ({
  isOnlySmart,
  isOnSale,
  category,
  onOnlySmartChange,
  onSaleChange
}: MoreFiltersProps) => {
  const isWearableCategory = category === NFTCategory.WEARABLE

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

  return (
    <Box
      header={t('nft_filters.more_filters')}
      className="filters-sidebar-box"
      collapsible
    >
      <div className="more-filters-section">
        <Radio
          label="On sale"
          toggle
          checked={isOnSale}
          onChange={handleOnSaleChange}
        />
        {isWearableCategory && (
          <Radio
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
