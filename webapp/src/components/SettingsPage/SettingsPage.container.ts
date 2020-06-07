import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { isPending as isTransactionPending } from 'decentraland-dapps/dist/modules/transaction/utils'

import { RootState } from '../../modules/reducer'
import { getWallet, isConnecting } from '../../modules/wallet/selectors'
import {
  getData as getAuthorizationsData,
  isLoading as isLoadingAuthorization,
  getAllowTransactions,
  getApproveTransactions
} from '../../modules/authorization/selectors'
import {
  allowTokenRequest,
  approveTokenRequest
} from '../../modules/authorization/actions'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './SettingsPage.types'
import SettingsPage from './SettingsPage'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)

  let authorizations = undefined
  let pendingAllowTransactions: Transaction[] = []
  let pendingApproveTransactions: Transaction[] = []
  if (wallet) {
    const allAuthorizations = getAuthorizationsData(state)
    authorizations = allAuthorizations[wallet.address]

    pendingAllowTransactions = getAllowTransactions(
      state
    ).filter((transaction: Transaction) =>
      isTransactionPending(transaction.status)
    )
    pendingApproveTransactions = getApproveTransactions(
      state
    ).filter((transaction: Transaction) =>
      isTransactionPending(transaction.status)
    )
  }

  return {
    wallet,
    authorizations,
    pendingAllowTransactions,
    pendingApproveTransactions,
    isLoadingAuthorization: isLoadingAuthorization(state),
    isConnecting: isConnecting(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onAllowToken: (
    isAllowed: boolean,
    contractName: string,
    tokenContractName: string
  ) => dispatch(allowTokenRequest(isAllowed, contractName, tokenContractName)),
  onApproveToken: (
    isApproved: boolean,
    contractName: string,
    tokenContractName: string
  ) =>
    dispatch(approveTokenRequest(isApproved, contractName, tokenContractName)),
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(SettingsPage)
