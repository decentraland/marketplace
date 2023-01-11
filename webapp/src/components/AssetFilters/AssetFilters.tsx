import { useCallback } from 'react'
import {
  EmotePlayMode,
  GenderFilterOption,
  Network,
  Rarity,
  WearableGender
} from '@dcl/schemas'
import { getSectionFromCategory } from '../../modules/routing/search'
import { AssetType } from '../../modules/asset/types'
import { isLandSection } from '../../modules/ui/utils'
import { getNetwork } from '../../utils/filters'
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
import { AssetFilter, filtersBySection } from './utilts'
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
  onBrowse
}: Props): JSX.Element | null => {
  const isPrimarySell = assetType === AssetType.ITEM
  const isInLandSection = isLandSection(section)

  const handlePriceChange = useCallback(
    (value: [string, string]) => {
      const [minPrice, maxPrice] = value
      onBrowse({ minPrice, maxPrice })
    },
    [onBrowse]
  )

  const handleRarityChange = useCallback(
    (value: Rarity[]) => {
      onBrowse({ rarities: value })
    },
    [onBrowse]
  )

  const handleNetworkChange = useCallback(
    (value: Network) => {
      onBrowse({ network: value })
    },
    [onBrowse]
  )

  const handleBodyShapeChange = useCallback(
    (value: (WearableGender | GenderFilterOption)[]) => {
      onBrowse({ wearableGenders: value })
    },
    [onBrowse]
  )

  const handleOnlySmartChange = useCallback(
    (value: boolean) => {
      onBrowse({ onlySmart: value })
    },
    [onBrowse]
  )

  const handleOnSaleChange = useCallback(
    (value: boolean) => {
      onBrowse({ onlyOnSale: value })
    },
    [onBrowse]
  )

  const handleEmotePlayModeChange = useCallback(
    (value: EmotePlayMode[]) => {
      onBrowse({ emotePlayMode: value })
    },
    [onBrowse]
  )

  function handleCollectionChange(value: string | undefined) {
    const newValue = value ? [value] : []
    onBrowse({ contracts: newValue })
  }

  function handleLandStatusChange(value: LANDFilters) {
    switch (value) {
      case LANDFilters.ALL_LAND:
        onBrowse({ onlyOnSale: undefined, onlyOnRent: undefined })
        break
      case LANDFilters.ONLY_FOR_RENT:
        onBrowse({ onlyOnSale: undefined, onlyOnRent: true })
        break
      case LANDFilters.ONLY_FOR_SALE:
        onBrowse({ onlyOnSale: true, onlyOnRent: undefined })
        break
    }
  }

  const shouldRenderFilter = useCallback(
    (filter: AssetFilter) => {
      // /lands page won't have any category, we fallback to the section, that will be Section.LAND
      const parentSection = category
        ? getSectionFromCategory(category)
        : section
      return filtersBySection[parentSection]?.includes(filter)
    },
    [category, section]
  )

  if (isInLandSection) {
    return (
      <div className="filters-sidebar">
        <PriceFilter
          onChange={handlePriceChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          network={getNetwork(network, category)}
        />
        <LandStatusFilter
          landStatus={landStatus}
          onChange={handleLandStatusChange}
        />
      </div>
    )
  }

  return (
    <Menu className="filters-sidebar">
      {shouldRenderFilter(AssetFilter.Rarity) ? (
        <RarityFilter onChange={handleRarityChange} rarities={rarities} />
      ) : null}
      <PriceFilter
        onChange={handlePriceChange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        network={getNetwork(network, category)}
      />
      {shouldRenderFilter(AssetFilter.Collection) ? (
        <CollectionFilter
          onChange={handleCollectionChange}
          collection={collection}
          onlyOnSale={isOnSale}
        />
      ) : null}
      {shouldRenderFilter(AssetFilter.PlayMode) && (
        <EmotePlayModeFilter
          onChange={handleEmotePlayModeChange}
          emotePlayMode={emotePlayMode}
        />
      )}
      {shouldRenderFilter(AssetFilter.Network) && !isPrimarySell && (
        <NetworkFilter onChange={handleNetworkChange} network={network} />
      )}
      {shouldRenderFilter(AssetFilter.BodyShape) && (
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
