import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps,
  OwnProps,
  Props
} from './FavoritesCounter.types'
import FavoritesCounter from './FavoritesCounter'

// TOOD: use the values from the store
const mapState = (_state: RootState): MapStateProps => ({
  isPickedByUser: Math.floor(Math.random() * 2) > 0,
  count: Math.floor(Math.random() * 50)
})

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

const mergeProps = (
  stateProps: MapStateProps,
  dispatchProps: MapDispatchProps,
  ownProps: OwnProps
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  isCollapsed: ownProps.isCollapsed ?? false
})

export default connect(mapState, mapDispatch, mergeProps)(FavoritesCounter)
