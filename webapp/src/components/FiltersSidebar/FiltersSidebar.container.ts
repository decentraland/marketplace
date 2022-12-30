import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../modules/reducer'
import { browse } from '../../modules/routing/actions'
import { getCategoryFromSection } from '../../modules/routing/search'
import { getAssetType, getContracts, getEmotePlayMode, getMaxPrice, getMinPrice, getNetwork, getOnlyOnSale, getOnlySmart, getRarities, getSection, getWearableGenders } from '../../modules/routing/selectors'
import { MapStateProps, MapDispatchProps } from './FiltersSidebar.types'
import { FiltersSidebar } from './FiltersSidebar'

const mapState = (state: RootState): MapStateProps => {
  const section = getSection(state)
  const contracts = getContracts(state)

  return {
    minPrice: getMinPrice(state),
    maxPrice: getMaxPrice(state),
    rarities: getRarities(state),
    network: getNetwork(state),
    bodyShapes: getWearableGenders(state),
    category: section ? getCategoryFromSection(section) : undefined,
    isOnlySmart: getOnlySmart(state),
    isOnSale: getOnlyOnSale(state),
    emotePlayMode: getEmotePlayMode(state),
    assetType: getAssetType(state),
    collection: contracts[0]
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(FiltersSidebar)
