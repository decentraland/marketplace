import Navigation from './Navigation'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { RootState } from '../../modules/reducer'
import { getAddress } from '../../modules/wallet/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './Navigation.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Navigation)
