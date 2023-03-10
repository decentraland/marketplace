import { useCallback, useMemo } from 'react'
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
import { View } from '../../modules/ui/types'
import { Sections, SortBy } from '../../modules/routing/types'
import { LANDFilters } from '../Vendor/decentraland/types'
import { Menu } from '../Menu'
import PriceFilter from './PriceFilter'
import EstateSizeFilter from './EstateSizeFilter'
import CreatorsFilter from './CreatorsFilter'
import { RarityFilter } from './RarityFilter'
import { NetworkFilter } from './NetworkFilter'
import { Props } from './AssetFilters.types'
import { CollectionFilter } from './CollectionFilter'
import { LandStatusFilter } from './LandStatusFilter'
import { BodyShapeFilter } from './BodyShapeFilter'
import { MoreFilters } from './MoreFilters'
import { EmotePlayModeFilter } from './EmotePlayModeFilter'
import { LocationFilter } from './LocationFilter'
import { AssetFilter, filtersBySection } from './utils'
import './AssetFilters.css'
import { RentalPeriodFilter } from './RentalPeriodFilter/RentalPeriodFilter'

export const AssetFilters = ({
  minPrice,
  maxPrice,
  minEstateSize,
  maxEstateSize,
  collection,
  creators,
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
  defaultCollapsed,
  onBrowse,
  view,
  minDistanceToPlaza,
  maxDistanceToPlaza,
  adjacentToRoad,
  values,
  rentalDays,
  isPriceFilterEnabled,
  isEstateSizeFilterEnabled,
  isLocationFilterEnabled,
  isCreatorFiltersEnabled,
  isRentalPeriodFilterEnabled
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

  const handleRangeFilterChange = useCallback(
    (filterNames: [string, string], value: [string, string]) => {
      const [filterMinName, filterMaxName] = filterNames
      const [minPrice, maxPrice] = value
      onBrowse({ [filterMinName]: minPrice, [filterMaxName]: maxPrice })
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
      // when toggling off the on sale filter, we need to reset the sortBy to avoid invalid combinations with the on sale sort options
      onBrowse(
        value
          ? { onlyOnSale: value }
          : { onlyOnSale: value, sortBy: SortBy.NEWEST }
      )
    },
    [onBrowse]
  )

  const handleEmotePlayModeChange = useCallback(
    (value: EmotePlayMode[]) => {
      onBrowse({ emotePlayMode: value })
    },
    [onBrowse]
  )

  const handleRentalDaysChange = useCallback(
    (value: number[]) => {
      onBrowse({ rentalDays: value })
    },
    [onBrowse]
  )

  const handleAdjacentToRoadChange = useCallback(
    (value?: boolean) => {
      onBrowse({ adjacentToRoad: value })
    },
    [onBrowse]
  )

  const handleDistanceToPlazaChange = useCallback(
    (distanceToPlazaRange?: [string, string]) => {
      if (distanceToPlazaRange) {
        const [minDistanceToPlaza, maxDistanceToPlaza] = distanceToPlazaRange
        onBrowse({ minDistanceToPlaza, maxDistanceToPlaza })
      }
    },
    [onBrowse]
  )

  function handleCollectionChange(value: string | undefined) {
    const newValue = value ? [value] : []
    onBrowse({ contracts: newValue })
  }

  function handleCreatorsChange(value: string[] | undefined) {
    onBrowse({ creators: value })
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

  const locationFilters = useMemo(
    () => ({
      adjacentToRoad,
      minDistanceToPlaza,
      maxDistanceToPlaza
    }),
    [adjacentToRoad, maxDistanceToPlaza, minDistanceToPlaza]
  )

  const shouldRenderFilter = useCallback(
    (filter: AssetFilter) => {
      // /lands page won't have any category, we fallback to the section, that will be Section.LAND
      const parentSection = category
        ? getSectionFromCategory(category)
        : section
      return filtersBySection[parentSection!]?.includes(filter)
    },
    [category, section]
  )

  if (isInLandSection) {
    return (
      <div className="filters-sidebar">
        <LandStatusFilter
          landStatus={landStatus}
          onChange={handleLandStatusChange}
        />
        {isPriceFilterEnabled ? (
          <PriceFilter
            onChange={handlePriceChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            values={values}
          />
        ) : null}
        {isEstateSizeFilterEnabled &&
        section !== Sections.decentraland.PARCELS ? (
          <EstateSizeFilter
            landStatus={landStatus}
            values={values}
            min={minEstateSize}
            max={maxEstateSize}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={values =>
              handleRangeFilterChange(
                ['minEstateSize', 'maxEstateSize'],
                values
              )
            }
            {...locationFilters}
          />
        ) : null}
        {isRentalPeriodFilterEnabled &&
          landStatus === LANDFilters.ONLY_FOR_RENT && (
            <RentalPeriodFilter
              rentalDays={rentalDays}
              onChange={handleRentalDaysChange}
            />
          )}
        {isLocationFilterEnabled && (
          <LocationFilter
            {...locationFilters}
            onAdjacentToRoadChange={handleAdjacentToRoadChange}
            onDistanceToPlazaChange={handleDistanceToPlazaChange}
          />
        )}
      </div>
    )
  }

  return (
    <Menu className="filters-sidebar">
      {shouldRenderFilter(AssetFilter.Rarity) ? (
        <RarityFilter
          onChange={handleRarityChange}
          rarities={rarities}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Network]}
        />
      ) : null}
      {isPriceFilterEnabled &&
      shouldRenderFilter(AssetFilter.Price) &&
      isOnSale &&
      view !== View.ACCOUNT ? (
        <PriceFilter
          onChange={handlePriceChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Price]}
          values={values}
        />
      ) : null}
      {isCreatorFiltersEnabled &&
      shouldRenderFilter(AssetFilter.Creators) &&
      (!network || (network && network === Network.MATIC)) ? (
        <CreatorsFilter
          creators={creators}
          onChange={handleCreatorsChange}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Creators]}
        />
      ) : null}
      {shouldRenderFilter(AssetFilter.Collection) ? (
        <CollectionFilter
          onChange={handleCollectionChange}
          collection={collection}
          onlyOnSale={isOnSale}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Collection]}
        />
      ) : null}

      {shouldRenderFilter(AssetFilter.PlayMode) && (
        <EmotePlayModeFilter
          onChange={handleEmotePlayModeChange}
          emotePlayMode={emotePlayMode}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.PlayMode]}
        />
      )}
      {shouldRenderFilter(AssetFilter.Network) && !isPrimarySell && (
        <NetworkFilter
          onChange={handleNetworkChange}
          network={network}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Network]}
        />
      )}
      {shouldRenderFilter(AssetFilter.BodyShape) && (
        <BodyShapeFilter
          onChange={handleBodyShapeChange}
          bodyShapes={bodyShapes}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.BodyShape]}
        />
      )}
      {shouldRenderFilter(AssetFilter.More) && (
        <MoreFilters
          category={category}
          isOnSale={isOnSale}
          isOnlySmart={isOnlySmart}
          onSaleChange={handleOnSaleChange}
          onOnlySmartChange={handleOnlySmartChange}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.More]}
        />
      )}
    </Menu>
  )
}
