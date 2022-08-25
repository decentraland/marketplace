import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { browse } from '../../../../modules/routing/actions'
import {
  getOnlyOnSale,
  getOnlyOnRent
} from '../../../../modules/routing/selectors'
import {
  LandFilter,
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './NFTLandFilters.types'
import NFTLandFilters from './NFTLandFilters'

const mapState = (state: RootState): MapStateProps => {
  const onlyOnSale = getOnlyOnSale(state)
  const onlyOnRent = getOnlyOnRent(state)

  let selectedFilter: LandFilter

  if (onlyOnRent) {
    selectedFilter = LandFilter.RENT
  } else if (onlyOnSale) {
    selectedFilter = LandFilter.SALE
  } else {
    selectedFilter = LandFilter.ALL
  }

  return {
    selectedFilter
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => {
  return {
    onLandFilterChange: browseOptions => dispatch(browse(browseOptions))
  }
}

export default connect(mapState, mapDispatch)(NFTLandFilters)
