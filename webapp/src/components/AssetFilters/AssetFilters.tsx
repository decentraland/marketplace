import { useCallback, useMemo } from 'react'
import { EmotePlayMode, GenderFilterOption, Network, Rarity, WearableGender } from '@dcl/schemas'
import { SmartWearableFilter } from 'decentraland-ui'
import { RarityFilter } from 'decentraland-dapps/dist/containers/RarityFilter'
import { getSectionFromCategory } from '../../modules/routing/search'
import { isLandSection } from '../../modules/ui/utils'
import { AssetStatusFilter } from '../../utils/filters'
import { View } from '../../modules/ui/types'
import { Sections, SortBy, BrowseOptions } from '../../modules/routing/types'
import { LANDFilters } from '../Vendor/decentraland/types'
import { Menu } from '../Menu'
import PriceFilter from './PriceFilter'
import EstateSizeFilter from './EstateSizeFilter'
import CreatorsFilter from './CreatorsFilter'
import { NetworkFilter } from './NetworkFilter'
import { Props } from './AssetFilters.types'
import { CollectionFilter } from './CollectionFilter'
import { LandStatusFilter } from './LandStatusFilter'
import { BodyShapeFilter } from './BodyShapeFilter'
import { RentalPeriodFilter } from './RentalPeriodFilter'
import { MoreFilters } from './MoreFilters'
import { EmoteAttributesFilter } from './EmoteAttributesFilter'
import { LocationFilter } from './LocationFilter'
import { AssetFilter, filtersBySection, trackBarChartComponentChange } from './utils'
import { StatusFilter } from './StatusFilter'
import './AssetFilters.css'

export const AssetFilters = ({
  minPrice,
  maxPrice,
  minEstateSize,
  maxEstateSize,
  collection,
  creators,
  rarities,
  status,
  network,
  category,
  bodyShapes,
  isOnlySmart,
  isOnSale,
  emotePlayMode,
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
  emoteHasSound,
  emoteHasGeometry
}: Props): JSX.Element | null => {
  const isInLandSection = isLandSection(section)

  const handleBrowseParamChange = useCallback((options: BrowseOptions) => onBrowse(options), [onBrowse])

  const handleRangeFilterChange = useCallback(
    (filterNames: [string, string], value: [string, string], source, prevValues: [string, string]) => {
      const [filterMinName, filterMaxName] = filterNames
      const [minValue, maxValue] = value
      onBrowse({ [filterMinName]: minValue, [filterMaxName]: maxValue })
      trackBarChartComponentChange(filterNames, value, source, prevValues)
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
      onBrowse(value ? { onlyOnSale: value } : { onlyOnSale: value, sortBy: SortBy.NEWEST })
    },
    [onBrowse]
  )

  const handleEmoteAttributesChange = useCallback(
    (value: { emotePlayMode?: EmotePlayMode[]; emoteHasSound?: boolean; emoteHasGeometry?: boolean }) => {
      onBrowse({
        emotePlayMode: value.emotePlayMode,
        emoteHasSound: value.emoteHasSound,
        emoteHasGeometry: value.emoteHasGeometry
      })
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
      const parentSection = category ? getSectionFromCategory(category) : section
      return filtersBySection[parentSection!]?.includes(filter)
    },
    [category, section]
  )

  if (isInLandSection) {
    return (
      <div className="filters-sidebar">
        <LandStatusFilter landStatus={landStatus} onChange={handleLandStatusChange} />
        <PriceFilter
          onChange={(value, source) => handleRangeFilterChange(['minPrice', 'maxPrice'], value, source, [minPrice, maxPrice])}
          minPrice={minPrice}
          maxPrice={maxPrice}
          values={values}
        />

        {section !== Sections.decentraland.PARCELS ? (
          <EstateSizeFilter
            landStatus={landStatus}
            values={values}
            min={minEstateSize}
            max={maxEstateSize}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={(values, source) =>
              handleRangeFilterChange(['minEstateSize', 'maxEstateSize'], values, source, [minEstateSize, maxEstateSize])
            }
            {...locationFilters}
          />
        ) : null}
        {landStatus === LANDFilters.ONLY_FOR_RENT && <RentalPeriodFilter rentalDays={rentalDays} onChange={handleRentalDaysChange} />}
        <LocationFilter
          {...locationFilters}
          onAdjacentToRoadChange={handleAdjacentToRoadChange}
          onDistanceToPlazaChange={handleDistanceToPlazaChange}
        />
      </div>
    )
  }

  return (
    <Menu className="filters-sidebar">
      {shouldRenderFilter(AssetFilter.PlayMode) && (
        <EmoteAttributesFilter
          onChange={handleEmoteAttributesChange}
          emotePlayMode={emotePlayMode}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.PlayMode]}
          emoteHasSound={emoteHasSound}
          emoteHasGeometry={emoteHasGeometry}
        />
      )}
      {shouldRenderFilter(AssetFilter.OnlySmart) ? (
        <SmartWearableFilter isOnlySmart={isOnlySmart} onChange={handleOnlySmartChange} />
      ) : null}
      {shouldRenderFilter(AssetFilter.Rarity) ? (
        <RarityFilter
          className="filters-sidebar-box"
          onChange={handleRarityChange}
          rarities={rarities}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Network]}
        />
      ) : null}
      {shouldRenderFilter(AssetFilter.Status) && view === View.MARKET ? (
        <StatusFilter onChange={handleBrowseParamChange} status={status} defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Status]} />
      ) : null}
      {shouldRenderFilter(AssetFilter.Price) &&
      (isOnSale || (!!status && status !== AssetStatusFilter.NOT_FOR_SALE)) &&
      view !== View.ACCOUNT ? (
        <PriceFilter
          onChange={(value, source) => handleRangeFilterChange(['minPrice', 'maxPrice'], value, source, [minPrice, maxPrice])}
          minPrice={minPrice}
          maxPrice={maxPrice}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Price]}
          values={values}
        />
      ) : null}
      {shouldRenderFilter(AssetFilter.Creators) && (!network || (network && network === Network.MATIC)) ? (
        <CreatorsFilter creators={creators} onChange={handleCreatorsChange} defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Creators]} />
      ) : null}
      {shouldRenderFilter(AssetFilter.Collection) ? (
        <CollectionFilter
          onChange={handleCollectionChange}
          collection={collection}
          onlyOnSale={isOnSale}
          defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Collection]}
        />
      ) : null}
      {shouldRenderFilter(AssetFilter.Network) && status !== AssetStatusFilter.ONLY_MINTING && (
        <NetworkFilter onChange={handleNetworkChange} network={network} defaultCollapsed={!!defaultCollapsed?.[AssetFilter.Network]} />
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
