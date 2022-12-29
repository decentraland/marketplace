import { useCallback } from 'react'
import { EmotePlayMode, Network, NFTCategory, Rarity } from '@dcl/schemas'
import { WearableGender } from '../../modules/nft/wearable/types'
import { PriceFilter } from './PriceFilter'
import { RarityFilter } from './RarityFilter'
import { NetworkFilter } from './NetworkFilter'
import { Props } from './FiltersSidebar.types'
import './FiltersSidebar.css'
import { BodyShapeFilter } from './BodyShapeFilter'
import { MoreFilters } from './MoreFilters'
import { EmotePlayModeFilter } from './EmotePlayModeFilter'
import { AssetType } from '../../modules/asset/types'

export const FiltersSidebar = ({
  minPrice,
  maxPrice,
  rarities,
  network,
  category,
  bodyShapes,
  isOnlySmart,
  isOnSale,
  emotePlayMode,
  assetType,
  onBrowse
}: Props): JSX.Element => {
  const isWearableCategory = category === NFTCategory.WEARABLE
  const isEmoteCategory = category === NFTCategory.EMOTE
  const isPrimarySell = assetType === AssetType.ITEM

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
    (value: EmotePlayMode) => {
      onBrowse({ emotePlayMode: value })
    },
    [onBrowse]
  )

  return (
    <div className="filters-sidebar">
      <RarityFilter onChange={handleRarityChange} rarities={rarities} />
      <PriceFilter
        onChange={handlePriceChange}
        minPrice={minPrice}
        maxPrice={maxPrice}
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
    </div>
  )
}
