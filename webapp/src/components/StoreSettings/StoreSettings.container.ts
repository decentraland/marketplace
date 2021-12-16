import { connect } from 'react-redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatchProps } from './StoreSettings.types'
import StoreSettings from './StoreSettings'
import { getLocalStore, getStoresByOwner } from '../../modules/store/selectors'
import { getEmptyLocalStore } from '../../modules/store/utils'
import { Dispatch } from 'redux'
import { Store } from '../../modules/store/types'
import { updateLocalStore } from '../../modules/store/actions'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)

  return {
    store:
      getLocalStore(state) ||
      (address && getStoresByOwner(state)[address]) ||
      getEmptyLocalStore()
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onChange: (store: Store) => dispatch(updateLocalStore(store))
  }
}

export default connect(mapState, mapDispatch)(StoreSettings)
