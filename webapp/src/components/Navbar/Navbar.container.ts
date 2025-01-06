import { connect } from 'react-redux'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { getIsChainSelectorEnabled, getIsNavbar2Enabled } from '../../modules/features/selectors'
import { getCurrentIdentity } from '../../modules/identity/selectors'
import { RootState } from '../../modules/reducer'
import { getTransactions } from '../../modules/transaction/selectors'
import Navbar from './Navbar'
import { MapStateProps } from './Navbar.types'

const mapState = (state: RootState): MapStateProps => ({
  hasPendingTransactions: getTransactions(state).some((tx: { status: TransactionStatus | null }) => isPending(tx.status)),
  identity: getCurrentIdentity(state) || undefined,
  isChainSelectorEnabled: getIsChainSelectorEnabled(state),
  isNavbar2Enabled: getIsNavbar2Enabled(state)
})

export default connect(mapState)(Navbar)
