import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { setView } from '../../modules/ui/actions'
import { fetchNFTsFromRoute } from '../../modules/routing/actions'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { getLoading } from '../../modules/nft/selectors'
import { getIsMap } from '../../modules/routing/selectors'
import { MapDispatch, MapDispatchProps, MapStateProps } from './NFTBrowse.types'
import NFTBrowse from './NFTBrowse'

const mapState = (state: RootState): MapStateProps => ({
  isMap: getIsMap(state),
  isLoading: isLoadingType(getLoading(state), FETCH_NFTS_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetView: view => dispatch(setView(view)),
  onFetchNFTsFromRoute: options => dispatch(fetchNFTsFromRoute(options))
})

export default connect(mapState, mapDispatch)(NFTBrowse)
