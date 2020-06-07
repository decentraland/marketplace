import { takeEvery, all, put } from 'redux-saga/effects'
import { walletSaga as baseWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_SUCCESS,
  ChangeAccountAction,
  ChangeNetworkAction,
  CHANGE_ACCOUNT,
  CHANGE_NETWORK
} from 'decentraland-dapps/dist/modules/wallet/actions'

import { fetchAuthorizationRequest } from '../authorization/actions'
import { AuthorizationsRequest } from '../authorization/types'
import { contractAddresses, contractCategories } from '../contract/utils'

export function* walletSaga() {
  yield all([baseWalletSaga(), fullWalletSaga()])
}

function* fullWalletSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleWallet)
  yield takeEvery(CHANGE_ACCOUNT, handleWallet)
  yield takeEvery(CHANGE_NETWORK, handleWallet)
}

function* handleWallet(
  action: ConnectWalletSuccessAction | ChangeAccountAction | ChangeNetworkAction
) {
  const { address } = action.payload.wallet

  const { MANAToken, Marketplace, Bids } = contractAddresses

  const authorization: AuthorizationsRequest = {
    allowances: {
      [Marketplace]: [MANAToken],
      [Bids]: [MANAToken]
    },
    approvals: {
      [Marketplace]: Object.keys(contractCategories)
    }
  }

  yield put(fetchAuthorizationRequest(address, authorization))
}
