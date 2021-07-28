import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { browseNFTs } from '../../modules/routing/actions'
import { getNFTs, getCount, getItems } from '../../modules/ui/browse/selectors'
import {
  getVendor,
  getPage,
  getResultType
} from '../../modules/routing/selectors'
import { getLoading as getLoadingNFTs } from '../../modules/nft/selectors'
import { getLoading as getLoadingItems } from '../../modules/item/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './NFTList.types'
import NFTList from './NFTList'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state),
  resultType: getResultType(state),
  nfts: getNFTs(state),
  items: getItems(state),
  page: getPage(state),
  count: getCount(state),
  isLoading:
    isLoadingType(getLoadingNFTs(state), FETCH_NFTS_REQUEST) ||
    isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browseNFTs(options))
})

export default connect(mapState, mapDispatch)(NFTList)
