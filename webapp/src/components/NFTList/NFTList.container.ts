import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { browse } from '../../modules/routing/actions'
import { getNFTs, getAssetsCount } from '../../modules/ui/selectors'
import { getVendor, getPage } from '../../modules/routing/selectors'
import { getLoading } from '../../modules/nft/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './NFTList.types'
import NFTList from './NFTList'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state),
  nfts: getNFTs(state),
  page: getPage(state),
  count: getAssetsCount(state),
  isLoading: isLoadingType(getLoading(state), FETCH_NFTS_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(NFTList)
