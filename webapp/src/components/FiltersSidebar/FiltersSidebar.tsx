import { useCallback } from 'react'
import { useNotMobileMediaQuery } from 'decentraland-ui'
import { EmotePlayMode, Network, NFTCategory, Rarity } from '@dcl/schemas'
import { WearableGender } from '../../modules/nft/wearable/types'
import { AssetType } from '../../modules/asset/types'
import { isLandSection } from '../../modules/ui/utils'
import { LANDFilters } from '../Vendor/decentraland/types'
import { PriceFilter } from './PriceFilter'
import { RarityFilter } from './RarityFilter'
import { NetworkFilter } from './NetworkFilter'
import { Props } from './FiltersSidebar.types'
import { CollectionFilter } from './CollectionFilter'
import { LandStatusFilter } from './LandStatusFilter'
import { BodyShapeFilter } from './BodyShapeFilter'
import { MoreFilters } from './MoreFilters'
import { EmotePlayModeFilter } from './EmotePlayModeFilter'
import './FiltersSidebar.css'

export const FiltersSidebar = ({
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
  onBrowse
}: Props): JSX.Element => {
  const isWearableCategory = category === NFTCategory.WEARABLE
  const isEmoteCategory = category === NFTCategory.EMOTE
  const isPrimarySell = assetType === AssetType.ITEM
  const isInLandSection = isLandSection(section)
  const isNotMobile = useNotMobileMediaQuery()

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
    (value: WearableGender[]) => {
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
    const newValue = value ? [value] : [];
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


  if (isInLandSection && isNotMobile && isRentalsEnabled) {
    return (
      <div className="filters-sidebar">
        <LandStatusFilter landStatus={landStatus} onChange={handleLandStatusChange} />
      </div>
    )
  }

  return (
    <div className="filters-sidebar">
      <RarityFilter onChange={handleRarityChange} rarities={rarities} />
      <PriceFilter
        onChange={handlePriceChange}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
      <CollectionFilter onChange={handleCollectionChange} collection={collection} onlyOnSale={isOnSale}  />
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
    </div>
  )
}
