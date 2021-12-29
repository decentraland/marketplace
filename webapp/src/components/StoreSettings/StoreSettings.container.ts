import { connect } from 'react-redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatchProps } from './StoreSettings.types'
import StoreSettings from './StoreSettings'
import {
  getData as getStoresByOwner,
  getLocalStore
} from '../../modules/store/selectors'
import { Dispatch } from 'redux'
import { Store } from '../../modules/store/types'
import {
  fetchStoreRequest,
  revertLocalStore,
  updateLocalStore,
  updateStoreRequest
} from '../../modules/store/actions'
import { getEmptyLocalStore } from '../../modules/store/utils'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)!
  const baseStore = getStoresByOwner(state)[address!] || getEmptyLocalStore()
  const store =
    getLocalStore(state) || getStoresByOwner(state)[address!] || baseStore
  const canSubmit = JSON.stringify(store) !== JSON.stringify(baseStore)

  return {
    address,
    store,
    canSubmit
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onChange: (store: Store) => dispatch(updateLocalStore(store)),
    onRevert: () => dispatch(revertLocalStore()),
    onSave: (store: Store) => dispatch(updateStoreRequest(store)),
    onFetchStore: (address: string) => dispatch(fetchStoreRequest(address))
  }
}

export default connect(mapState, mapDispatch)(StoreSettings)
