import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { MapStateProps, MapDispatch, MapDispatchProps } from './Atlas.types'
import { getTiles } from '../../modules/tile/selectors'
import { RootState } from '../../modules/reducer'
import Atlas from './Atlas'

const mapState = (state: RootState): MapStateProps => ({
  tiles: getTiles(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(Atlas)
