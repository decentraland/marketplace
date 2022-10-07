import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { MapDispatchProps, MapDispatch } from './MVMFBanner.types'
import MVMFBanner from './MVMFBanner'

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(null, mapDispatch)(MVMFBanner)
