import { connect } from 'react-redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatchProps, Props } from './StoreSettings.types'
import StoreSettings from './StoreSettings'
import { getBaseStore, getLocalStore } from '../../modules/store/selectors'
import { Dispatch } from 'redux'
import { Store } from '../../modules/store/types'
import { revertLocalStore, updateLocalStore } from '../../modules/store/actions'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)
  const baseStore = getBaseStore(state)
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
    onRevert: (address?: string) => dispatch(revertLocalStore(address))
  }
}

const mergeProps = (
  stateProps: MapStateProps,
  dispatchProps: MapDispatchProps
): Props => {
  return {
    ...stateProps,
    ...dispatchProps,
    onRevert: () => dispatchProps.onRevert(stateProps.address)
  }
}

export default connect(mapState, mapDispatch, mergeProps)(StoreSettings)
