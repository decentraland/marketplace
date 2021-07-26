import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { setView } from '../../modules/ui/actions'
import { fetchItemsFromRoute } from '../../modules/routing/actions'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { getLoading } from '../../modules/nft/selectors'
import { getOnlyOnSale } from '../../modules/routing/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './ItemBrowse.types'
import ItemBrowse from './ItemBrowse'
import { getView } from '../../modules/ui/browse/selectors'

const mapState = (state: RootState): MapStateProps => ({
  isOnSale: getOnlyOnSale(state),
  isLoading: isLoadingType(getLoading(state), FETCH_NFTS_REQUEST),
  viewInState: getView(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetView: view => dispatch(setView(view)),
  onFetchItemsFromRoute: options => dispatch(fetchItemsFromRoute(options))
})

export default connect(mapState, mapDispatch)(ItemBrowse)
