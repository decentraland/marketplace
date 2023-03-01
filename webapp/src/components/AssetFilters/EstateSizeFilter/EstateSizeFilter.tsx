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
  min,
  max,
  landStatus,
  minPrice,
  maxPrice,
  adjacentToRoad,
  minDistanceToPlaza,
  maxDistanceToPlaza,
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

  const filters = useMemo(
    () => ({
      maxPrice,
      minPrice,
      isOnSale: landStatus === LANDFilters.ONLY_FOR_SALE || undefined,
      adjacentToRoad: adjacentToRoad || undefined,
      minDistanceToPlaza: Number(minDistanceToPlaza) || undefined,
      maxDistanceToPlaza: Number(maxDistanceToPlaza) || undefined
    }),
    [
      adjacentToRoad,
      landStatus,
      minDistanceToPlaza,
      maxDistanceToPlaza,
      maxPrice,
      minPrice
    ]
  )

  const fetcher = useCallback(async () => {
    if (landStatus === LANDFilters.ONLY_FOR_RENT) {
      // for rents, we don't have the data yet, so let's just resolve with an empty object so the chart is not rendered
      return {}
    }
    const data = await nftAPI.fetchEstateSizes(filters)
    return data
  }, [filters, landStatus])

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
        min={min}
        max={max}
        minLabel={t('filters.estate_size.min_label')}
        maxLabel={t('filters.estate_size.max_label')}
        onChange={onChange}
        errorMessage={t('filters.estate_size.error')}
        rangeDecimals={0}
      />
    </Box>
  )
}
