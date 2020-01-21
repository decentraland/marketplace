import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Atlas.types'
import { RootState } from '../../modules/reducer'
import Atlas from './Atlas'

const mapState = (_state: RootState): MapStateProps => ({})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Atlas)
