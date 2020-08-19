import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import { getVendor, getSection } from '../../../modules/routing/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './NFTSidebar.types'
import NFTSidebar from './NFTSidebar'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state),
  section: getSection(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(NFTSidebar)
