import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { fetchNFTsRequest, FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { getNFTs } from '../../modules/ui/selectors'
import { getLoading } from '../../modules/nft/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './PartnersPage.types'
import PartnersPage from './PartnersPage'

const mapState = (state: RootState): MapStateProps => ({
  nfts: getNFTs(state),
  isLoading: isLoadingType(getLoading(state), FETCH_NFTS_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onFetchNFTs: options => dispatch(fetchNFTsRequest(options))
})

export default connect(mapState, mapDispatch)(PartnersPage)
