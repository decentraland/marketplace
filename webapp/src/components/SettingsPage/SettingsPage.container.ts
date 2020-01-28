import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { getTransactionsByType } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { isPending as isTransactionPending } from 'decentraland-dapps/dist/modules/transaction/utils'

import { RootState } from '../../modules/reducer'
import { getWallet, isConnecting } from '../../modules/wallet/selectors'
import { getData as getAuthorizationsData } from '../../modules/authorization/selectors'
import {
  ALLOW_TOKEN_SUCCESS,
  APPROVE_TOKEN_SUCCESS
} from '../../modules/authorization/actions'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './SettingsPage.types'
import SettingsPage from './SettingsPage'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)

  let authorizations = null
  let pendingAllowTransactions: Transaction[] = []
  let pendingApproveTransactions: Transaction[] = []
  if (wallet) {
    const allAuthorizations = getAuthorizationsData(state)
    authorizations = allAuthorizations[wallet.address]

    pendingAllowTransactions = getTransactionsByType(
      state,
      wallet.address,
      ALLOW_TOKEN_SUCCESS
    ).filter((transaction: Transaction) =>
      isTransactionPending(transaction.status)
    )
    pendingApproveTransactions = getTransactionsByType(
      state,
      wallet.address,
      APPROVE_TOKEN_SUCCESS
    ).filter((transaction: Transaction) =>
      isTransactionPending(transaction.status)
    )
  }

  return {
    wallet,
    authorizations,
    pendingAllowTransactions,
    pendingApproveTransactions,
    isConnecting: isConnecting(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(SettingsPage)
