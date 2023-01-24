import { useEffect, useState, useMemo } from 'react'
import { ethers } from 'ethers'
import { Box, PriceChart, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { LANDFilters } from '../../Vendor/decentraland/types'
import { getNetwork, getPriceLabel } from '../../../utils/filters'
import { nftAPI } from '../../../modules/vendor/decentraland'
import { Section } from '../../../modules/vendor/routing/types'
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
  const [isLoading, setIsLoading] = useState(false)
  const [prices, setPrices] = useState<Record<string, number>>()
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

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setIsLoading(true)
        const prices = await nftAPI.fetchPrices(priceFetchFilters)
        if (!cancel) {
          setIsLoading(false)
          setPrices(prices)
        }
      } catch (e) {
        console.warn('Could not fetch prices')
        setIsLoading(false)
      }
    })()
    return () => {
      cancel = false
    }
  }, [section, priceFetchFilters])

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

  const formattedPrices = useMemo(() => {
    if (prices && landStatus === LANDFilters.ONLY_FOR_SALE) {
      return Object.entries(prices).reduce((acc, [key, value]) => {
        acc[ethers.utils.formatEther(key)] = value
        return acc
      }, {} as Record<string, number>)
    }
  }, [landStatus, prices])

  return (
    <Box
      header={header}
      className="filters-sidebar-box price-filter"
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <PriceChart
        loading={isLoading}
        prices={formattedPrices}
        maxPrice={maxPrice}
        minPrice={minPrice}
        upperBound={upperBound}
        network={network || getNetwork(network, category)}
        onChange={onChange}
        errorMessage={t('filters.price_min_greater_max')}
      />
    </Box>
  )
}
