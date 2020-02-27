import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './NFTListPage.types'
import { RootState } from '../../modules/reducer'
import { fetchNFTsRequest, FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import {
  getNFTs,
  getUIPage,
  getUISection,
  getUISortBy,
  getUIOnlyOnSale,
  getAssetsCount,
  getUIWearableRarities,
  getUIWearableGenders
} from '../../modules/ui/selectors'
import { getLoading } from '../../modules/nft/selectors'
import NFTListPage from './NFTListPage'

const mapState = (state: RootState): MapStateProps => ({
  nfts: getNFTs(state),
  page: getUIPage(state),
  section: getUISection(state),
  sortBy: getUISortBy(state),
  count: getAssetsCount(state),
  wearableRarities: getUIWearableRarities(state),
  wearableGenders: getUIWearableGenders(state),
  onlyOnSale: getUIOnlyOnSale(state),
  isLoading: isLoadingType(getLoading(state), FETCH_NFTS_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchNFTs: options => dispatch(fetchNFTsRequest(options))
})

export default connect(mapState, mapDispatch)(NFTListPage)
