import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { RootState } from '../../../../modules/reducer'
import { getUISection } from '../../../../modules/ui/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './NFTSidebar.types'
import NFTSidebar from './NFTSidebar'

const mapState = (state: RootState): MapStateProps => ({
  section: getUISection(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(NFTSidebar)
