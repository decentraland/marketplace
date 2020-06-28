import { connect } from 'react-redux'

import { RootState } from '../../../../modules/reducer'
import {
  getUISection,
  getUISortBy,
  getUIOnlyOnSale,
  getAssetsCount,
  getUISearch
} from '../../../../modules/ui/selectors'
import { MapStateProps } from './NFTFilters.types'
import NFTFilters from './NFTFilters'

const mapState = (state: RootState): MapStateProps => ({
  section: getUISection(state),
  sortBy: getUISortBy(state),
  search: getUISearch(state),
  count: getAssetsCount(state),
  onlyOnSale: getUIOnlyOnSale(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(NFTFilters)
