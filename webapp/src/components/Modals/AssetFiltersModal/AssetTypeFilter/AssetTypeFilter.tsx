import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Box, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { useCallback, useMemo } from 'react'
import { AssetType } from '../../../../modules/asset/types'
import { SelectFilter } from '../../../Vendor/NFTFilters/SelectFilter'
import './AssetTypeFilter.css'

type Props = {
  assetType: AssetType
  onChange: (assetType: AssetType) => void
}

export const AssetTypeFilter = ({ assetType, onChange }: Props): JSX.Element => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const assetTypeOptions = useMemo(() => {
    return [
      {
        value: AssetType.ITEM,
        text: t('filters.item')
      },
      {
        value: AssetType.NFT,
        text: t('filters.nft')
      }
    ]
  }, [])

  const handleAssetTypeChange = useCallback((type: string) => {
    onChange(type as AssetType)
  }, [onChange])

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('filters.type')}</span>
          <span className="box-filter-value">{t(`filters.${assetType}`)}</span>
        </div>
      ) : (
        t('filters.type')
      ),
    [isMobileOrTablet, assetType]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box asset-type-filter"
      collapsible
      defaultCollapsed={true}
    >
      <SelectFilter
        name=""
        value={assetType || ''}
        options={assetTypeOptions}
        onChange={handleAssetTypeChange}
      />
    </Box>
  )
}
