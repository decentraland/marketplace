import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'

import { RootState } from '../../modules/reducer'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './Navigation.types'
import Navigation from './Navigation'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Navigation)
