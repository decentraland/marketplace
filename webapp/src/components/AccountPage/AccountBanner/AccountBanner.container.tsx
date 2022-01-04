import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getAddress as getAddressFromUrl } from '../../../modules/account/selectors'
import { RootState } from '../../../modules/reducer'
import { goBack } from '../../../modules/routing/actions'
import { getViewAsGuest } from '../../../modules/routing/selectors'
import {
  fetchStoreRequest,
  FETCH_STORE_REQUEST
} from '../../../modules/store/actions'
import {
  getStoresByOwner,
  getLocalStore,
  getLoading as getStoreLoading
} from '../../../modules/store/selectors'
import { Store } from '../../../modules/store/types'
import { getAddress as getAddressFromWallet } from '../../../modules/wallet/selectors'
import AccountBanner from './AccountBanner'
import { MapStateProps, MapDispatchProps } from './AccountBanner.types'

const mapState = (state: RootState): MapStateProps => {
  const viewAsGuest = getViewAsGuest(state)
  const address = getAddressFromUrl(state) || getAddressFromWallet(state)
  const isLoading = isLoadingType(getStoreLoading(state), FETCH_STORE_REQUEST)

  let store: Store | undefined = address
    ? getStoresByOwner(state)[address]
    : undefined

  if (viewAsGuest) {
    store = getLocalStore(state) || store
  }

  return {
    store,
    isLoading
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBack: () => dispatch(goBack()),
    onFetchStore: (address: string) => dispatch(fetchStoreRequest(address))
  }
}

export default connect(mapState, mapDispatch)(AccountBanner)
