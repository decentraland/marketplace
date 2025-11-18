import React, { useMemo } from 'react'
import { useGetBrowseOptions } from '../../../modules/routing/hooks'
import { getCategoryFromSection } from '../../../modules/routing/search'
import { Section } from '../../../modules/vendor/routing/types'
import { LANDFilters } from '../../Vendor/decentraland/types'
import { PriceFilter } from './PriceFilter'
import { ContainerProps } from './PriceFilter.types'

export const PriceFilterContainer: React.FC<ContainerProps> = props => {
  const browseOptions = useGetBrowseOptions()

  const { values = {}, minPrice, maxPrice, defaultCollapsed, onChange } = props
  const section = 'section' in values ? (values.section as Section) : (browseOptions.section as Section)
  const onlyOnSale = 'onlyOnSale' in values ? values.onlyOnSale : browseOptions.onlyOnSale
  const onlyOnRent = browseOptions.onlyOnRent

  const landStatus = useMemo(() => {
    if (onlyOnRent && !onlyOnSale) {
      return LANDFilters.ONLY_FOR_RENT
    } else if (onlyOnSale && !onlyOnRent) {
      return LANDFilters.ONLY_FOR_SALE
    }
    return LANDFilters.ALL_LAND
  }, [onlyOnRent, onlyOnSale])

  const computedProps = useMemo(
    () => ({
      category: section ? getCategoryFromSection(section as string) : undefined,
      assetType: browseOptions.assetType,
      rarities: 'rarities' in values ? values.rarities || [] : browseOptions.rarities || [],
      network: 'network' in values ? values.network : browseOptions.network,
      bodyShapes: 'wearableGenders' in values ? values.wearableGenders : browseOptions.wearableGenders,
      isOnlySmart: browseOptions.onlySmart,
      emotePlayMode: values.emotePlayMode || browseOptions.emotePlayMode || [],
      collection: 'contracts' in values ? values.contracts?.[0] : browseOptions.contracts?.[0],
      minDistanceToPlaza: 'minDistanceToPlaza' in values ? values.minDistanceToPlaza : browseOptions.minDistanceToPlaza,
      maxDistanceToPlaza: 'maxDistanceToPlaza' in values ? values.maxDistanceToPlaza : browseOptions.maxDistanceToPlaza,
      adjacentToRoad: 'adjacentToRoad' in values ? values.adjacentToRoad : browseOptions.adjacentToRoad,
      minEstateSize: 'minEstateSize' in values ? values.minEstateSize || '' : browseOptions.minEstateSize || '',
      maxEstateSize: 'maxEstateSize' in values ? values.maxEstateSize || '' : browseOptions.maxEstateSize || '',
      rentalDays: 'rentalDays' in values ? values.rentalDays : browseOptions.rentalDays,
      emoteHasGeometry: 'emoteHasGeometry' in values ? values.emoteHasGeometry : browseOptions.emoteHasGeometry,
      emoteHasSound: 'emoteHasSound' in values ? values.emoteHasSound : browseOptions.emoteHasSound
    }),
    [values, browseOptions]
  )

  return (
    <PriceFilter
      {...computedProps}
      section={section}
      defaultCollapsed={defaultCollapsed}
      landStatus={landStatus}
      minPrice={minPrice}
      maxPrice={maxPrice}
      onChange={onChange}
    />
  )
}

export default PriceFilterContainer
