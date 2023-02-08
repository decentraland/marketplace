import { useMemo, useCallback } from 'react'
import { ethers } from 'ethers'
import { Box, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getNetwork, getPriceLabel } from '../../../utils/filters'
import { LANDFilters } from '../../Vendor/decentraland/types'
import { nftAPI } from '../../../modules/vendor/decentraland'
import { Section } from '../../../modules/vendor/routing/types'
import Inventory from '../Inventory'
import { getChartUpperBound, getPriceFiltersForSection } from './utils'
import { Props } from './PriceFilter.types'
import './PriceFilter.css'

export type PriceFilterProps = {
  minPrice: string
  maxPrice: string
  network?: Network
  onChange: (value: [string, string]) => void
  defaultCollapsed?: boolean
}

export const PriceFilter = ({
  section,
  category,
  minPrice,
  maxPrice,
  network,
  defaultCollapsed = false,
  assetType,
  isOnlySmart,
  landStatus,
  rarities,
  bodyShapes,
  collection,
  emotePlayMode,
  onChange
}: Props) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const priceFetchFilters = useMemo(() => {
    return {
      assetType,
      isWearableSmart: isOnlySmart,
      rarities,
      wearableGenders: bodyShapes,
      contracts: collection ? [collection] : undefined,
      emotePlayMode,
      network,
      ...getPriceFiltersForSection(section as Section)
    }
  }, [
    assetType,
    bodyShapes,
    collection,
    emotePlayMode,
    isOnlySmart,
    network,
    rarities,
    section
  ])

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

  const upperBound = useMemo(() => {
    return Number(ethers.utils.formatEther(getChartUpperBound(section)))
  }, [section])

  const fetcher = useCallback(async () => {
    if (landStatus === LANDFilters.ONLY_FOR_RENT) {
      // for rents, we don't have the data yet, so let's just resolve the promise with an empty object so the chart is not rendered
      return {}
    }
    const data: Record<string, number> = await nftAPI.fetchPrices(
      priceFetchFilters
    )
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[ethers.utils.formatEther(key)] = value
      return acc
    }, {} as Record<string, number>)
  }, [priceFetchFilters, landStatus])

  return (
    <Box
      header={header}
      className="filters-sidebar-box price-filter"
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <Inventory
        isMana
        fetcher={fetcher}
        max={maxPrice}
        min={minPrice}
        upperBound={upperBound}
        network={network || getNetwork(network, category)}
        onChange={onChange}
        errorMessage={t('filters.price_min_greater_max')}
      />
    </Box>
  )
}
