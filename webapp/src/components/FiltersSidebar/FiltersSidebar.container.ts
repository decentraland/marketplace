import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../modules/reducer'
import { browse } from '../../modules/routing/actions'
import { getMaxPrice, getMinPrice } from '../../modules/routing/selectors'
import { MapStateProps, MapDispatchProps } from './FiltersSidebar.types'
import { FiltersSidebar } from './FiltersSidebar'

const mapState = (state: RootState): MapStateProps => {
  return {
    minPrice: getMinPrice(state),
    maxPrice: getMaxPrice(state)
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(FiltersSidebar)
