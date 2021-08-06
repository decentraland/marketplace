import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import { getVendor } from '../../../modules/routing/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps,
  Props,
  OwnProps
} from './NFTFilters.types'
import NFTFilters from './NFTFilters'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

const mergeProps = (
  stateProps: MapStateProps,
  dispatchProps: MapDispatchProps,
  ownProps: OwnProps
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
})

export default connect(mapState, mapDispatch, mergeProps)(NFTFilters)
