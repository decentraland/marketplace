import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getViewAsGuest } from '../../../modules/routing/selectors'
import { getLocalStore } from '../../../modules/store/selectors'
import { Store } from '../../../modules/store/types'
import AccountBanner from './AccountBanner'
import { MapStateProps } from './AccountBanner.types'

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

export default connect(mapState, null)(AccountBanner)
