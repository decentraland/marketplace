import { connect } from 'react-redux'

import { RootState } from '../../../../modules/reducer'
import {
  getSection,
  getSortBy,
  getOnlyOnSale
} from '../../../../modules/routing/selectors'
import { MapStateProps } from './NFTFilters.types'
import NFTFilters from './NFTFilters'

const mapState = (state: RootState): MapStateProps => ({
  section: getSection(state),
  sortBy: getSortBy(state),
  onlyOnSale: getOnlyOnSale(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(NFTFilters)
