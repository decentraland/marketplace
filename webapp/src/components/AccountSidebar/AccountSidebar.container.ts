import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { browse } from '../../modules/routing/actions'
import { getSection } from '../../modules/routing/selectors'
import AccountSidebar from './AccountSidebar'
import { MapDispatch, MapDispatchProps, MapStateProps } from './AccountSidebar.types'

const mapState = (state: RootState): MapStateProps => ({
  section: getSection(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(AccountSidebar)
