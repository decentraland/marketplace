import { connect } from 'react-redux'
import { isWeb2Wallet } from 'decentraland-dapps/dist/modules/wallet/utils'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import SubmitTransactionModal from './SubmitTransactionModal'
import { MapStateProps } from './SubmitTransactionModal.types'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)
  return {
    showConfirmMessage: !(wallet !== null && isWeb2Wallet(wallet))
  }
}

export default connect(mapState, {})(SubmitTransactionModal)
