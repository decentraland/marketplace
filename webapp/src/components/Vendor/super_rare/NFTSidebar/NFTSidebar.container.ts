import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { MapDispatch, MapDispatchProps } from './NFTSidebar.types'
import NFTSidebar from './NFTSidebar'

const mapState = () => ({})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(NFTSidebar)
