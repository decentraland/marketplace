import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { getLoading, getStoresByOwner } from '../../modules/store/selectors'
import {
  MapStateProps,
  OwnProps,
  MapDispatchProps
} from './StoreProvider.types'
import StoreProvider from './StoreProvider'
import {
  fetchStoreRequest,
  FETCH_STORE_REQUEST
} from '../../modules/store/actions'
import { Dispatch } from 'redux'

const mapState = (state: RootState, { address }: OwnProps): MapStateProps => {
  return {
    isLoading: isLoadingType(getLoading(state), FETCH_STORE_REQUEST),
    store: getStoresByOwner(state)[address]
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  { address }: OwnProps
): MapDispatchProps => {
  return {
    onFetchStore: () => dispatch(fetchStoreRequest(address))
  }
}

export default connect(mapState, mapDispatch)(StoreProvider)
