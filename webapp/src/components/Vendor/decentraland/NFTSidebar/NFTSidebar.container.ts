import { connect } from 'react-redux'

import { RootState } from '../../../../modules/reducer'
import { getSection } from '../../../../modules/routing/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './NFTSidebar.types'
import NFTSidebar from './NFTSidebar'

const mapState = (state: RootState): MapStateProps => ({
  section: getSection(state)
})

const mapDispatch = (_: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(NFTSidebar)
