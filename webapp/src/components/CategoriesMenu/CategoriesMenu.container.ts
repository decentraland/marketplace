import { connect } from 'react-redux'
import { push } from 'connected-react-router'

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

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(
  mapState,
  mapDispatch
)(CategoriesMenu)
