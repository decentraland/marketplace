import { useCallback } from 'react'
import { useNotMobileMediaQuery } from 'decentraland-ui'
import { EmotePlayMode, GenderFilterOption, Network, NFTCategory, Rarity, WearableGender } from '@dcl/schemas'
import { AssetType } from '../../modules/asset/types'
import { isLandSection } from '../../modules/ui/utils'
import { LANDFilters } from '../Vendor/decentraland/types'
import { Menu } from '../Menu'
import { PriceFilter } from './PriceFilter'
import { RarityFilter } from './RarityFilter'
import { NetworkFilter } from './NetworkFilter'
import { Props } from './AssetFilters.types'
import { CollectionFilter } from './CollectionFilter'
import { LandStatusFilter } from './LandStatusFilter'
import { BodyShapeFilter } from './BodyShapeFilter'
import { MoreFilters } from './MoreFilters'
import { EmotePlayModeFilter } from './EmotePlayModeFilter'
import './AssetFilters.css'

export const AssetFilters = ({
  minPrice,
  maxPrice,
  collection,
  rarities,
  network,
  category,
  bodyShapes,
  isOnlySmart,
  isOnSale,
  emotePlayMode,
  assetType,
  section,
  landStatus,
  isRentalsEnabled,
  onFilterChange
}: Props): JSX.Element => {
  const isWearableCategory = category === NFTCategory.WEARABLE
  const isEmoteCategory = category === NFTCategory.EMOTE
  const isPrimarySell = assetType === AssetType.ITEM
  const isInLandSection = isLandSection(section)
  const isNotMobile = useNotMobileMediaQuery()

  const handlePriceChange = useCallback(
    (value: [string, string]) => {
      const [minPrice, maxPrice] = value
      onFilterChange({ minPrice, maxPrice })
    },
    [onFilterChange]
  )

  const handleRarityChange = useCallback(
    (value: Rarity[]) => {
      onFilterChange({ rarities: value })
    },
    [onFilterChange]
  )

  const handleNetworkChange = useCallback(
    (value: Network) => {
      onFilterChange({ network: value })
    },
    [onFilterChange]
  )

  const handleBodyShapeChange = useCallback(
    (value: (WearableGender | GenderFilterOption)[]) => {
      onFilterChange({ wearableGenders: value })
    },
    [onFilterChange]
  )

  const handleOnlySmartChange = useCallback(
    (value: boolean) => {
      onFilterChange({ onlySmart: value })
    },
    [onFilterChange]
  )

  const handleOnSaleChange = useCallback(
    (value: boolean) => {
      onFilterChange({ onlyOnSale: value })
    },
    [onFilterChange]
  )

  const handleEmotePlayModeChange = useCallback(
    (value: EmotePlayMode[]) => {
      onFilterChange({ emotePlayMode: value })
    },
    [onFilterChange]
  )

  function handleCollectionChange(value: string | undefined) {
    const newValue = value ? [value] : []
    onFilterChange({ contracts: newValue })
  }

  function handleLandStatusChange(value: LANDFilters) {
    switch (value) {
      case LANDFilters.ALL_LAND:
        onFilterChange({ onlyOnSale: undefined, onlyOnRent: undefined })
        break
      case LANDFilters.ONLY_FOR_RENT:
        onFilterChange({ onlyOnSale: undefined, onlyOnRent: true })
        break
      case LANDFilters.ONLY_FOR_SALE:
        onFilterChange({ onlyOnSale: true, onlyOnRent: undefined })
        break
    }
  }

  if (isInLandSection && isNotMobile && isRentalsEnabled) {
    return (
      <div className="filters-sidebar">
        <LandStatusFilter
          landStatus={landStatus}
          onChange={handleLandStatusChange}
        />
      </div>
    )
  }

  return (
    <Menu className="filters-sidebar">
      <RarityFilter onChange={handleRarityChange} rarities={rarities} />
      <PriceFilter
        onChange={handlePriceChange}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
      <CollectionFilter
        onChange={handleCollectionChange}
        collection={collection}
        onlyOnSale={isOnSale}
      />
      {isEmoteCategory && (
        <EmotePlayModeFilter
          onChange={handleEmotePlayModeChange}
          emotePlayMode={emotePlayMode}
        />
      )}
      {isWearableCategory && !isPrimarySell && (
        <NetworkFilter onChange={handleNetworkChange} network={network} />
      )}
      {isWearableCategory && (
        <BodyShapeFilter
          onChange={handleBodyShapeChange}
          bodyShapes={bodyShapes}
        />
      )}
      <MoreFilters
        category={category}
        isOnSale={isOnSale}
        isOnlySmart={isOnlySmart}
        onSaleChange={handleOnSaleChange}
        onOnlySmartChange={handleOnlySmartChange}
      />
    </Menu>
  )
}
