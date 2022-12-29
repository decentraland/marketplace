import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../modules/reducer'
import { browse } from '../../modules/routing/actions'
import { getContracts, getMaxPrice, getMinPrice, getOnlyOnSale } from '../../modules/routing/selectors'
import { MapStateProps, MapDispatchProps } from './FiltersSidebar.types'
import { FiltersSidebar } from './FiltersSidebar'

const mapState = (state: RootState): MapStateProps => {
  const contracts = getContracts(state)
  return {
    minPrice: getMinPrice(state),
    maxPrice: getMaxPrice(state),
    onlyOnSale: getOnlyOnSale(state),
    collection: contracts[0]
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(FiltersSidebar)
