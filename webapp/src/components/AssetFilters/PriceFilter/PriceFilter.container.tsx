import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getCategoryFromSection } from '../../../modules/routing/search'
import {
  getAssetType,
  getContracts,
  getEmotePlayMode,
  getNetwork,
  getOnlyOnRent,
  getOnlyOnSale,
  getOnlySmart,
  getRarities,
  getSection,
  getWearableGenders,
  getMinDistanceToPlaza,
  getMaxDistanceToPlaza,
  getMinEstateSize,
  getMaxEstateSize,
  getAdjacentToRoad,
  getRentalDays,
  getEmoteHasGeometry,
  getEmoteHasSound
} from '../../../modules/routing/selectors'
import { Section } from '../../../modules/vendor/routing/types'
import { LANDFilters } from '../../Vendor/decentraland/types'
import { PriceFilter } from './PriceFilter'
import { MapStateProps, OwnProps } from './PriceFilter.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { values = {} } = ownProps
  const section = 'section' in values ? (values.section as Section) : getSection(state)
  const onlyOnSale = 'onlyOnSale' in values ? values.onlyOnSale : getOnlyOnSale(state)
  const onlyOnRent = getOnlyOnRent(state)
  let landStatus = LANDFilters.ALL_LAND

  if (onlyOnRent && !onlyOnSale) {
    landStatus = LANDFilters.ONLY_FOR_RENT
  } else if (onlyOnSale && !onlyOnRent) {
    landStatus = LANDFilters.ONLY_FOR_SALE
  }
  return {
    section,
    category: section ? getCategoryFromSection(section) : undefined,
    assetType: getAssetType(state),
    rarities: 'rarities' in values ? values.rarities || [] : getRarities(state),
    network: 'network' in values ? values.network : getNetwork(state),
    bodyShapes: 'wearableGenders' in values ? values.wearableGenders : getWearableGenders(state),
    isOnlySmart: getOnlySmart(state),
    landStatus,
    emotePlayMode: values.emotePlayMode || getEmotePlayMode(state),
    collection: 'contracts' in values ? values.contracts?.[0] : getContracts(state)[0],
    minDistanceToPlaza: 'minDistanceToPlaza' in values ? values.minDistanceToPlaza : getMinDistanceToPlaza(state),
    maxDistanceToPlaza: 'maxDistanceToPlaza' in values ? values.maxDistanceToPlaza : getMaxDistanceToPlaza(state),
    adjacentToRoad: 'adjacentToRoad' in values ? values.adjacentToRoad : getAdjacentToRoad(state),
    minEstateSize: 'minEstateSize' in values ? values.minEstateSize || '' : getMinEstateSize(state),
    maxEstateSize: 'maxEstateSize' in values ? values.maxEstateSize || '' : getMaxEstateSize(state),
    rentalDays: 'rentalDays' in values ? values.rentalDays : getRentalDays(state),
    emoteHasGeometry: 'emoteHasGeometry' in values ? values.emoteHasGeometry : getEmoteHasGeometry(state),
    emoteHasSound: 'emoteHasSound' in values ? values.emoteHasSound : getEmoteHasSound(state)
  }
}

export default connect(mapState)(PriceFilter)
