import { connect } from 'react-redux'

import { RootState } from '../../../../modules/reducer'
import { getAssetsCount } from '../../../../modules/ui/nft/browse/selectors'
import {
  getSection,
  getSortBy,
  getOnlyOnSale,
  getIsMap,
  getWearableRarities,
  getWearableGenders,
  getSearch,
  getContracts
} from '../../../../modules/routing/selectors'
import { MapStateProps } from './NFTFilters.types'
import NFTFilters from './NFTFilters'

const mapState = (state: RootState): MapStateProps => ({
  count: getAssetsCount(state),
  section: getSection(state),
  sortBy: getSortBy(state),
  search: getSearch(state),
  onlyOnSale: getOnlyOnSale(state),
  isMap: getIsMap(state),
  wearableRarities: getWearableRarities(state),
  wearableGenders: getWearableGenders(state),
  contracts: getContracts(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(NFTFilters)
