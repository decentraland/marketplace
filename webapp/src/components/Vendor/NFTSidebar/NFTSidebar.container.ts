import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import { getVendor, getSection } from '../../../modules/routing/selectors'
import { getIsRentalsEnabled } from '../../../modules/features/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps,
  OwnProps
} from './NFTSidebar.types'
import NFTSidebar from './NFTSidebar'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  vendor: getVendor(state),
  section: ownProps.section || getSection(state),
  isRentalsEnabled: getIsRentalsEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(NFTSidebar)
