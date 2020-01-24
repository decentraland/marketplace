import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatchProps, MapDispatch } from './NFTAction.types'
import NFTAction from './NFTAction'

const mapState = (_state: RootState): MapStateProps => ({})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(NFTAction)
