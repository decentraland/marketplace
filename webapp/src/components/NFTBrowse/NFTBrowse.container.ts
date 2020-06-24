import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { fetchNFTsRequest } from '../../modules/nft/actions'
import {
  getUIPage,
  getUISection,
  getUISortBy,
  getUIOnlyOnSale,
  getUIWearableRarities,
  getUIWearableGenders,
  getUISearch,
  getUIContracts
} from '../../modules/ui/selectors'
import { MapDispatch, MapDispatchProps, MapStateProps } from './NFTBrowse.types'
import NFTBrowse from './NFTBrowse'

const mapState = (state: RootState): MapStateProps => ({
  page: getUIPage(state),
  section: getUISection(state),
  sortBy: getUISortBy(state),
  wearableRarities: getUIWearableRarities(state),
  wearableGenders: getUIWearableGenders(state),
  contracts: getUIContracts(state),
  search: getUISearch(state),
  onlyOnSale: getUIOnlyOnSale(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchNFTs: (...args) => dispatch(fetchNFTsRequest(...args))
})

export default connect(mapState, mapDispatch)(NFTBrowse)
