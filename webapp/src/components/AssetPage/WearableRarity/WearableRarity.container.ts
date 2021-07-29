import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { MapDispatchProps, MapDispatch } from './WearableRarity.types'
import WearableRarity from './WearableRarity'

const mapState = () => ({})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(WearableRarity)
