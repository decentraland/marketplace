import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { browse } from '../../modules/routing/actions'
import { useGetBrowseOptions } from '../../modules/routing/hooks'
import { getCategoryFromSection } from '../../modules/routing/search'
import { getView } from '../../modules/ui/browse/selectors'
import { Section } from '../../modules/vendor/routing/types'
import { AssetStatusFilter } from '../../utils/filters'
import { LANDFilters } from '../Vendor/decentraland/types'
import { AssetFilters } from './AssetFilters'
import { ContainerProps } from './AssetFilters.types'

const AssetFiltersContainer: React.FC<ContainerProps> = ({ values = {}, onFilterChange, defaultCollapsed }) => {
  const dispatch = useDispatch()
  const browseOptions = useGetBrowseOptions()
  const view = useSelector(getView)

  const parameters = useMemo(
    () => ({
      section: 'section' in values ? (values.section as Section) : browseOptions.section,
      contracts: 'contracts' in values ? values.contracts || [] : browseOptions.contracts,
      creators: 'creators' in values ? values.creators || [] : browseOptions.creators,
      onlyOnSale: 'onlyOnSale' in values ? values.onlyOnSale : browseOptions.onlyOnSale,
      onlyOnRent: 'onlyOnRent' in values ? values.onlyOnRent : browseOptions.onlyOnRent,
      rarities: 'rarities' in values ? values.rarities || [] : browseOptions.rarities,
      status: 'status' in values ? values.status : (browseOptions.status as AssetStatusFilter),
      network: 'network' in values ? values.network : browseOptions.network,
      wearableGenders: 'wearableGenders' in values ? values.wearableGenders : browseOptions.wearableGenders,
      emotePlayMode: values.emotePlayMode || browseOptions.emotePlayMode,
      rentalDays: 'rentalDays' in values ? values.rentalDays : browseOptions.rentalDays,
      minDistanceToPlaza: 'minDistanceToPlaza' in values ? values.minDistanceToPlaza : browseOptions.minDistanceToPlaza,
      maxDistanceToPlaza: 'maxDistanceToPlaza' in values ? values.maxDistanceToPlaza : browseOptions.maxDistanceToPlaza,
      adjacentToRoad: 'adjacentToRoad' in values ? values.adjacentToRoad : browseOptions.adjacentToRoad,
      emoteHasSound: 'emoteHasSound' in values ? values.emoteHasSound : browseOptions.emoteHasSound,
      emoteHasGeometry: 'emoteHasGeometry' in values ? values.emoteHasGeometry : browseOptions.emoteHasGeometry,
      minPrice: 'minPrice' in values ? values.minPrice || '' : browseOptions.minPrice,
      maxPrice: 'maxPrice' in values ? values.maxPrice || '' : browseOptions.maxPrice,
      minEstateSize: 'minEstateSize' in values ? values.minEstateSize || '' : browseOptions.minEstateSize,
      maxEstateSize: 'maxEstateSize' in values ? values.maxEstateSize || '' : browseOptions.maxEstateSize
    }),
    [values, browseOptions]
  )

  const landStatus = useMemo(() => {
    if (parameters.onlyOnRent && !parameters.onlyOnSale) {
      return LANDFilters.ONLY_FOR_RENT
    } else if (parameters.onlyOnSale && !parameters.onlyOnRent) {
      return LANDFilters.ONLY_FOR_SALE
    }
    return LANDFilters.ALL_LAND
  }, [parameters.onlyOnRent, parameters.onlyOnSale])

  const category = useMemo(() => (parameters.section ? getCategoryFromSection(parameters.section) : undefined), [parameters.section])

  const handleBrowse = useCallback<ActionFunction<typeof browse>>(
    options => (onFilterChange ? onFilterChange(options) : dispatch(browse(options))),
    [onFilterChange, dispatch]
  )

  return (
    <AssetFilters
      {...parameters}
      defaultCollapsed={defaultCollapsed}
      category={category}
      collection={parameters.contracts?.[0] || ''}
      landStatus={landStatus}
      view={view}
      onBrowse={handleBrowse}
    />
  )
}

export default AssetFiltersContainer
