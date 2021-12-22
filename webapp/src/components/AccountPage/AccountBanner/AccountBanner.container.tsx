import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../../modules/reducer'
import { goBack } from '../../../modules/routing/actions'
import { getViewAsGuest } from '../../../modules/routing/selectors'
import { getLocalStore } from '../../../modules/store/selectors'
import { Store } from '../../../modules/store/types'
import AccountBanner from './AccountBanner'
import { MapStateProps, MapDispatchProps } from './AccountBanner.types'

const mapState = (state: RootState): MapStateProps => {
  const viewAsGuest = getViewAsGuest(state)

  let store: Store | undefined

  if (viewAsGuest) {
    store = getLocalStore(state) || undefined
  }

  return {
    store
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBack: () => dispatch(goBack())
  }
}

export default connect(mapState, mapDispatch)(AccountBanner)
