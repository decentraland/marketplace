import { connect } from 'react-redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatchProps } from './StoreSettings.types'
import StoreSettings from './StoreSettings'
import {
  getData as getStoresByOwner,
  getLocalStore,
  getLoading as getStoreLoading
} from '../../modules/store/selectors'
import { Dispatch } from 'redux'
import { Store } from '../../modules/store/types'
import {
  fetchStoreRequest,
  FETCH_STORE_REQUEST,
  revertLocalStore,
  updateLocalStore,
  updateStoreRequest,
  UPDATE_STORE_REQUEST
} from '../../modules/store/actions'
import { getEmptyLocalStore } from '../../modules/store/utils'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)!
  const savedStore = getStoresByOwner(state)[address!]
  const emptyStore = getEmptyLocalStore()
  const localStore = getLocalStore(state)
  const baseStore = savedStore || emptyStore
  const store = localStore || savedStore || baseStore
  const canSubmit = JSON.stringify(store) !== JSON.stringify(baseStore)
  const isLoading = isLoadingType(getStoreLoading(state), FETCH_STORE_REQUEST)
  const isSaving = isLoadingType(getStoreLoading(state), UPDATE_STORE_REQUEST)

  return {
    address,
    store,
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
