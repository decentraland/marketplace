import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatchProps } from './StoreSettings.types'
import StoreSettings from './StoreSettings'
import {
  getStoresByOwner,
  getLocalStore,
  getLoading as getStoreLoading,
  getError
} from '../../modules/store/selectors'
import { Store } from '../../modules/store/types'
import {
  fetchStoreRequest,
  FETCH_STORE_REQUEST,
  revertLocalStore,
  updateLocalStore,
  updateStoreRequest,
  UPDATE_STORE_REQUEST
} from '../../modules/store/actions'
import { getEmptyStore } from '../../modules/store/utils'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)!
  const savedStore = getStoresByOwner(state)[address!]
  const emptyStore = getEmptyStore({ owner: address })
  const localStore = getLocalStore(state)
  const baseStore = savedStore || emptyStore
  const store = localStore || baseStore
  const canSubmit = JSON.stringify(store) !== JSON.stringify(baseStore)
  const isLoading = isLoadingType(getStoreLoading(state), FETCH_STORE_REQUEST)
  const isSaving = isLoadingType(getStoreLoading(state), UPDATE_STORE_REQUEST)
  const error = getError(state)

  return {
    address,
    store,
    error,
    canSubmit,
    isLoading,
    isSaving
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onChange: (store: Store) => dispatch(updateLocalStore(store)),
    onRevert: (address: string) => dispatch(revertLocalStore(address)),
    onSave: (store: Store) => dispatch(updateStoreRequest(store)),
    onFetchStore: (address: string) => dispatch(fetchStoreRequest(address))
  }
}

export default connect(mapState, mapDispatch)(StoreSettings)
