import { connect } from 'react-redux'

import { RootState } from '../../../../modules/reducer'
import { getCount } from '../../../../modules/ui/browse/selectors'
import {
  getSection,
  getSortBy,
  getOnlyOnSale,
  getSearch
} from '../../../../modules/routing/selectors'
import { MapStateProps } from './NFTFilters.types'
import NFTFilters from './NFTFilters'

const mapState = (state: RootState): MapStateProps => ({
  count: getCount(state),
  section: getSection(state),
  sortBy: getSortBy(state),
  search: getSearch(state),
  onlyOnSale: getOnlyOnSale(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(NFTFilters)
