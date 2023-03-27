import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './FavoritesCounter.types'
import FavoritesCounter from './FavoritesCounter'

// TOOD: use the values from the store
const mapState = (_state: RootState): MapStateProps => ({
  isPickedByUser: Math.floor(Math.random() * 2) > 0,
  count: Math.floor(Math.random() * 5000)
})

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(FavoritesCounter)
