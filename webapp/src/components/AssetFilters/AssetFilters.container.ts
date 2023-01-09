import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getCategoryFromSection } from '../../modules/routing/search'
import { getAssetType, getContracts, getEmotePlayMode, getMaxPrice, getMinPrice, getNetwork, getOnlyOnRent, getOnlyOnSale, getOnlySmart, getRarities, getSection, getWearableGenders } from '../../modules/routing/selectors'
import { MapStateProps, OwnProps } from './AssetFilters.types'
import { AssetFilters } from './AssetFilters'
import { LANDFilters } from '../Vendor/decentraland/types'
import { getIsRentalsEnabled } from '../../modules/features/selectors'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { values = {} } = ownProps;
  const section = getSection(state)
  const contracts = values.contracts || getContracts(state)
  const onlyOnSale = values.onlyOnSale || getOnlyOnSale(state)
  const onlyOnRent = values.onlyOnRent || getOnlyOnRent(state)
  let landStatus = LANDFilters.ALL_LAND;

  if (onlyOnRent) {
    landStatus = LANDFilters.ONLY_FOR_RENT
  } else if (onlyOnSale) {
    landStatus = LANDFilters.ONLY_FOR_SALE
  }


  return {
    minPrice: values.minPrice || getMinPrice(state),
    maxPrice: values.maxPrice || getMaxPrice(state),
    rarities: values.rarities || getRarities(state),
    network: values.network || getNetwork(state),
    bodyShapes: values.wearableGenders || getWearableGenders(state),
    category: section ? getCategoryFromSection(section) : undefined,
    isOnlySmart: values.onlySmart || getOnlySmart(state),
    isOnSale: onlyOnSale,
    emotePlayMode: values.emotePlayMode || getEmotePlayMode(state),
    assetType: getAssetType(state),
    isRentalsEnabled: getIsRentalsEnabled(state),
    collection: contracts[0],
    landStatus,
    section
  }
}

export default connect(mapState)(AssetFilters)
