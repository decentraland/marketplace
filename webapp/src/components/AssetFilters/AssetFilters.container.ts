import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../modules/reducer'
import { browse } from '../../modules/routing/actions'
import { getCategoryFromSection } from '../../modules/routing/search'
import { getAssetType, getContracts, getEmotePlayMode, getMaxPrice, getMinPrice, getNetwork, getOnlyOnRent, getOnlyOnSale, getOnlySmart, getRarities, getSection, getWearableGenders } from '../../modules/routing/selectors'
import { MapStateProps, MapDispatchProps } from './AssetFilters.types'
import { AssetFilters } from './AssetFilters'
import { LANDFilters } from '../Vendor/decentraland/types'
import { getIsRentalsEnabled } from '../../modules/features/selectors'

const mapState = (state: RootState): MapStateProps => {
  const section = getSection(state)
  const contracts = getContracts(state)
  const onlyOnSale = getOnlyOnSale(state)
  const onlyOnRent = getOnlyOnRent(state)
  let landStatus = LANDFilters.ALL_LAND;

  if (onlyOnRent) {
    landStatus = LANDFilters.ONLY_FOR_RENT
  } else if (onlyOnSale) {
    landStatus = LANDFilters.ONLY_FOR_SALE
  }


  return {
    minPrice: getMinPrice(state),
    maxPrice: getMaxPrice(state),
    rarities: getRarities(state),
    network: getNetwork(state),
    bodyShapes: getWearableGenders(state),
    category: section ? getCategoryFromSection(section) : undefined,
    isOnlySmart: getOnlySmart(state),
    isOnSale: onlyOnSale,
    emotePlayMode: getEmotePlayMode(state),
    assetType: getAssetType(state),
    isRentalsEnabled: getIsRentalsEnabled(state),
    collection: contracts[0],
    landStatus,
    section
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(AssetFilters)
