import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { RootState } from '../../modules/reducer'
import { getVendor } from '../../modules/vendor/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './BrowsePage.types'
import BrowsePage from './BrowsePage'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state)!
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(BrowsePage)
