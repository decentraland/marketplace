import { connect } from 'react-redux'
import { getIsOffchainPublicItemOrdersEnabled, getIsOffchainPublicNFTOrdersEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import TransactionHistory from './TransactionHistory'
import { MapStateProps } from './TransactionHistory.types'

const mapState = (state: RootState): MapStateProps => ({
  isOffchainPublicItemOrdersEnabled: getIsOffchainPublicItemOrdersEnabled(state),
  isOffchainPublicNFTOrdersEnabled: getIsOffchainPublicNFTOrdersEnabled(state)
})

export default connect(mapState)(TransactionHistory)
