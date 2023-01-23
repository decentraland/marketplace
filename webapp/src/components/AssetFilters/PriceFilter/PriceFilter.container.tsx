import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getAssetType, getSection } from '../../../modules/routing/selectors'
import { MapStateProps } from './PriceFilter.types'
import { PriceFilter } from './PriceFilter'

const mapState = (state: RootState): MapStateProps => ({
  section: getSection(state),
  assetType: getAssetType(state)
})

export default connect(mapState)(PriceFilter)
