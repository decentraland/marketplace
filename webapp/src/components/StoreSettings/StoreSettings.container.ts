import { connect } from 'react-redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatchProps } from './StoreSettings.types'
import StoreSettings from './StoreSettings'
import { getLocalStore } from '../../modules/store/selectors'
import { Dispatch } from 'redux'
import { Store } from '../../modules/store/types'
import { revertLocalStore, updateLocalStore, updateStoreRequest } from '../../modules/store/actions'
import { getEmptyLocalStore } from '../../modules/store/utils'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)
  const baseStore = getEmptyLocalStore()
  const store = getLocalStore(state) || baseStore
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
    onSave: () => dispatch(updateStoreRequest())
  }
}

export default connect(mapState, mapDispatch)(StoreSettings)
