import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { browseItems } from '../../modules/routing/actions'
import { getCount, getItems } from '../../modules/ui/browse/selectors'
import { getPage } from '../../modules/routing/selectors'
import { getLoading } from '../../modules/nft/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './ItemList.types'
import NFTList from './ItemList'

const mapState = (state: RootState): MapStateProps => ({
  items: getItems(state),
  page: getPage(state),
  count: getCount(state),
  isLoading: isLoadingType(getLoading(state), FETCH_NFTS_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browseItems(options))
})

export default connect(mapState, mapDispatch)(NFTList)
