import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { getUISection } from '../../../modules/ui/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './CategoriesSidebar.types'
import CategoriesSidebar from './CategoriesSidebar'

const mapState = (state: RootState): MapStateProps => ({
  section: getUISection(state)
})

const mapDispatch = (_: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(CategoriesSidebar)
