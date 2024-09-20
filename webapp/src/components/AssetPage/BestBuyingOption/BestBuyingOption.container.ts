import { connect } from 'react-redux'
import { getIsOffchainPublicNFTOrdersEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import BestBuyingOption from './BestBuyingOption'
import { MapStateProps } from './BestBuyingOption.types'

const mapState = (state: RootState): MapStateProps => ({
  isOffchainPublicNFTOrdersEnabled: getIsOffchainPublicNFTOrdersEnabled(state)
})

export default connect(mapState)(BestBuyingOption)
