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
import { Section } from '../../../modules/vendor/routing/types'
import { MapStateProps, OwnProps } from './PriceFilter.types'
import { PriceFilter } from './PriceFilter'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { values = {} } = ownProps
  const section =
    'section' in values ? (values.section as Section) : getSection(state)
  return {
    section,
    category: section ? getCategoryFromSection(section) : undefined,
    assetType: getAssetType(state),
    rarities: 'rarities' in values ? values.rarities || [] : getRarities(state),
    network: 'network' in values ? values.network : getNetwork(state),
    bodyShapes:
      'wearableGenders' in values
        ? values.wearableGenders
        : getWearableGenders(state),
    isOnlySmart: getOnlySmart(state),
    emotePlayMode: values.emotePlayMode || getEmotePlayMode(state),
    collection:
      'contracts' in values ? values.contracts?.[0] : getContracts(state)[0]
  }
}

export default connect(mapState)(PriceFilter)
