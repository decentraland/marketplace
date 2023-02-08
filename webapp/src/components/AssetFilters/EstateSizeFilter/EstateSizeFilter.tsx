import { useMemo, useCallback } from 'react'
import { Box, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { nftAPI } from '../../../modules/vendor/decentraland/nft/api'
import { LANDFilters } from '../../Vendor/decentraland/types'
import { getPriceLabel } from '../../../utils/filters'
import { Inventory } from '../Inventory/Inventory'
import { Props } from './EstateSizeFilter.types'
import './EstateSizeFilter.css'

export const EstateSizeFilter = ({
  landStatus,
  minPrice,
  maxPrice,
  network,
  defaultCollapsed = false,
  onChange
}: Props) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">
            {t('filters.estate_size.label')}
          </span>
          <span className="box-filter-value">
            {getPriceLabel(minPrice, maxPrice, network)}
          </span>
        </div>
      ) : (
        t('filters.estate_size.label')
      ),
    [minPrice, maxPrice, network, isMobileOrTablet]
  )

  const fetcher = useCallback(async () => {
    if (landStatus === LANDFilters.ONLY_FOR_RENT) {
      // for rents, we don't have the data yet, so let's just resolve with an empty object so the chart is not rendered
      return {}
    }
    const data = await nftAPI.fetchEstateSizes(
      landStatus === LANDFilters.ONLY_FOR_SALE || undefined
    )
    return data
  }, [landStatus])

  return (
    <Box
      header={header}
      className="filters-sidebar-box estate-size-filter"
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <Inventory
        fetcher={fetcher}
        isMana={false}
        min={minPrice}
        minLabel={t('filters.estate_size.min_label')}
        max={maxPrice}
        maxLabel={t('filters.estate_size.max_label')}
        onChange={onChange}
        errorMessage={t('filters.estate_size.error')}
      />
    </Box>
  )
}
