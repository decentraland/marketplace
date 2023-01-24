import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import {
  getAssetType,
  getContracts,
  getEmotePlayMode,
  getNetwork,
  getOnlySmart,
  getRarities,
  getSection,
  getWearableGenders
} from '../../../modules/routing/selectors'
import { getCategoryFromSection } from '../../../modules/routing/search'
import { MapStateProps } from './PriceFilter.types'
import { PriceFilter } from './PriceFilter'

const mapState = (state: RootState): MapStateProps => {
  const section = getSection(state)
  return {
    section: getSection(state),
    category: section ? getCategoryFromSection(section) : undefined,
    assetType: getAssetType(state),
    rarities: getRarities(state),
    network: getNetwork(state),
    bodyShapes: getWearableGenders(state),
    isOnlySmart: getOnlySmart(state),
    emotePlayMode: getEmotePlayMode(state),
    collection: getContracts(state)[0]
  }
}

export default connect(mapState)(PriceFilter)
