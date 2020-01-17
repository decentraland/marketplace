import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { getMarketSection } from '../../modules/ui/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './CategoriesMenu.types'
import CategoriesMenu from './CategoriesMenu'

const mapState = (state: RootState): MapStateProps => ({
  section: getMarketSection(state)
})

const mapDispatch = (_: MapDispatch): MapDispatchProps => ({})

export default connect(
  mapState,
  mapDispatch
)(CategoriesMenu)
