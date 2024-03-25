import { useMemo, useCallback } from 'react'
import { ethers } from 'ethers'
import { RentalsListingsFilterByCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Box, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { nftAPI } from '../../../modules/vendor/decentraland/nft/api'
import { rentalsAPI } from '../../../modules/vendor/decentraland/rentals/api'
import { Section } from '../../../modules/vendor/routing/types'
import { getNetwork, getPriceLabel } from '../../../utils/filters'
import { LANDFilters } from '../../Vendor/decentraland/types'
import Inventory from '../Inventory'
import { getChartUpperBound, getPriceFiltersForSection } from './utils'
import { Props } from './PriceFilter.types'
import './PriceFilter.css'

export const PriceFilter = ({
  section,
  category,
  minPrice,
  maxPrice,
  adjacentToRoad,
  minDistanceToPlaza,
  maxDistanceToPlaza,
  maxEstateSize,
  minEstateSize,
  network,
  defaultCollapsed = false,
  assetType,
  isOnlySmart,
  landStatus,
  rarities,
  bodyShapes,
  collection,
  emotePlayMode,
  rentalDays,
  emoteHasGeometry,
  emoteHasSound,
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
      ...getPriceFiltersForSection(section as Section),
      adjacentToRoad: adjacentToRoad || undefined,
      minDistanceToPlaza: minDistanceToPlaza || undefined,
      maxDistanceToPlaza: maxDistanceToPlaza || undefined,
      maxEstateSize,
      minEstateSize,
      emoteHasGeometry,
      emoteHasSound
    }
  }, [
    adjacentToRoad,
    assetType,
    bodyShapes,
    collection,
    emotePlayMode,
    isOnlySmart,
    maxDistanceToPlaza,
    maxEstateSize,
    minDistanceToPlaza,
    minEstateSize,
    network,
    rarities,
    section,
    emoteHasGeometry,
    emoteHasSound
  ])

  const rentalPriceFetchFilters = useCallback(
    () => ({
      category: category as any as RentalsListingsFilterByCategory,
      rentalDays,
      minEstateSize: minEstateSize ? Number.parseFloat(minEstateSize) : undefined,
      maxEstateSize: maxEstateSize ? Number.parseFloat(maxEstateSize) : undefined,
      minDistanceToPlaza: minDistanceToPlaza ? Number.parseFloat(minDistanceToPlaza) : undefined,
      maxDistanceToPlaza: maxDistanceToPlaza ? Number.parseFloat(maxDistanceToPlaza) : undefined,
      adjacentToRoad: adjacentToRoad || undefined
    }),
    [category, minEstateSize, maxEstateSize, minDistanceToPlaza, maxDistanceToPlaza, adjacentToRoad, rentalDays]
  )

  const title = useMemo(() => {
    if (landStatus === LANDFilters.ONLY_FOR_RENT) {
      return t('nft_filters.price_per_day')
    }
    return t('filters.price')
  }, [landStatus])

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{title}</span>
          <span className="box-filter-value">{getPriceLabel(minPrice, maxPrice, network)}</span>
        </div>
      ) : (
        title
      ),
    [minPrice, maxPrice, network, title, isMobileOrTablet]
  )

  const upperBound = useMemo(() => {
    return Number(ethers.utils.formatEther(getChartUpperBound(section)))
  }, [section])

  const fetcher = useCallback(async () => {
    let data: Record<string, number> = {}
    if (landStatus === LANDFilters.ONLY_FOR_RENT) {
      data = await rentalsAPI.getRentalListingsPrices(rentalPriceFetchFilters())
    } else {
      data = await nftAPI.fetchPrices(priceFetchFilters)
    }
    return Object.entries(data).reduce(
      (acc, [key, value]) => {
        acc[ethers.utils.formatEther(key)] = value
        return acc
      },
      {} as Record<string, number>
    )
  }, [priceFetchFilters, landStatus, rentalPriceFetchFilters])

  return (
    <Box header={header} className="filters-sidebar-box price-filter" collapsible defaultCollapsed={defaultCollapsed || isMobileOrTablet}>
      <Inventory
        isMana
        fetcher={fetcher}
        max={maxPrice}
        min={minPrice}
        upperBound={upperBound}
        network={getNetwork(network, category)}
        onChange={onChange}
        errorMessage={t('filters.price_min_greater_max')}
      />
    </Box>
  )
}
