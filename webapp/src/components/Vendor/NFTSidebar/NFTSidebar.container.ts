import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import { getVendor, getSection, getCurrentSearch } from '../../../modules/routing/selectors'
import NFTSidebar from './NFTSidebar'
import { MapStateProps, MapDispatch, MapDispatchProps, OwnProps } from './NFTSidebar.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  vendor: getVendor(state),
  section: ownProps.section || getSection(state),
  search: getCurrentSearch(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(NFTSidebar)
