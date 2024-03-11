import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { browse } from '../../modules/routing/actions'
import { getSection } from '../../modules/routing/selectors'
import { MapDispatch, MapDispatchProps, MapStateProps } from './AccountSidebar.types'
import AccountSidebar from './AccountSidebar'

const mapState = (state: RootState): MapStateProps => ({
  section: getSection(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(AccountSidebar)
