import { useCallback } from 'react'
import { Box, CheckboxProps, Radio, useMobileMediaQuery } from 'decentraland-ui'
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
  const isMobile = useMobileMediaQuery();

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

  const mobileBoxHeader = (
    <div className='mobile-box-header'>
      <span className="box-filter-name">{t('nft_filters.more_filters')}</span>
      <span className='box-filter-value'>For sale</span>
    </div>
  )

  return (
    <Box
      header={isMobile ? mobileBoxHeader : t('nft_filters.more_filters')}
      className="filters-sidebar-box"
      collapsible
      defaultCollapsed={isMobile}
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
