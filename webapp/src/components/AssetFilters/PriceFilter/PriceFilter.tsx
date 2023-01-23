import { useEffect, useState, useMemo } from 'react'
import { ethers } from 'ethers'
import { Box, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getPriceLabel } from '../../../utils/filters'
import { nftAPI } from '../../../modules/vendor/decentraland'
import { Section } from '../../../modules/vendor/routing/types'
import { getChartUpperBound, sectionToPriceFilterOptions } from './utils'
import { Props } from './PriceFilter.types'
import { PriceChart } from '../../PriceChart/PriceChart'
import './PriceFilter.css'

export type PriceFilterProps = {
  minPrice: string
  maxPrice: string
  network?: Network
  onChange: (value: [string, string]) => void
  defaultCollapsed?: boolean
}

export const PriceFilter = ({
  onChange,
  minPrice,
  maxPrice,
  network = Network.ETHEREUM,
  defaultCollapsed = false,
  section,
  assetType
}: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [prices, setPrices] = useState<Record<string, number>>()
  const [sectionPricesFetched, setSectionPricesFetched] = useState<string[]>([])
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  // when changing the asset type, clear the fetched "cache"
  useEffect(() => {
    setSectionPricesFetched([])
  }, [assetType])

  useEffect(() => {
    const pricesAlreadyFetched = sectionPricesFetched.includes(section)
    setIsLoading(!pricesAlreadyFetched)
  }, [assetType, section, sectionPricesFetched])

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const prices = await nftAPI.fetchPrices({
          category: sectionToPriceFilterOptions(section as Section),
          assetType
        })
        if (!cancel) {
          setIsLoading(false)
          setSectionPricesFetched([...sectionPricesFetched, section])
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
    // disabling the following rule since we don't want to execute the useEffect on the sectionPricesFetched change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, assetType])

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
    return (
      prices &&
      Object.entries(prices).reduce((acc, [key, value]) => {
        acc[ethers.utils.formatEther(key)] = value
        return acc
      }, {} as Record<string, number>)
    )
  }, [prices])

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
        network={network}
        onChange={onChange}
        errorMessage={t('filters.price_min_greater_max')}
      />
    </Box>
  )
}
