import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { browse } from '../../../../modules/routing/actions'
import {
  getOnlyOnSale,
  getOnlyOnRent
} from '../../../../modules/routing/selectors'
import { LANDFilters } from '../types'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './NFTLandFilters.types'
import NFTLandFilters from './NFTLandFilters'

const mapState = (state: RootState): MapStateProps => {
  const onlyOnSale = getOnlyOnSale(state)
  const onlyOnRent = getOnlyOnRent(state)

  let selectedFilter: LANDFilters

  if (onlyOnRent) {
    selectedFilter = LANDFilters.ONLY_FOR_RENT
  } else if (onlyOnSale) {
    selectedFilter = LANDFilters.ONLY_FOR_SALE
  } else {
    selectedFilter = LANDFilters.ALL_LAND
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
