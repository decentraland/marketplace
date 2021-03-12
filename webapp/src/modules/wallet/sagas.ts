import { takeEvery, all, put } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_SUCCESS,
  ChangeAccountAction,
  ChangeNetworkAction,
  CHANGE_ACCOUNT,
  CHANGE_NETWORK
} from 'decentraland-dapps/dist/modules/wallet/actions'

import { NFTCategory } from '../nft/types'
import { fetchAuthorizationRequest } from '../authorization/actions'
import { AuthorizationsRequest } from '../authorization/types'
import { contractAddresses, contractCategories } from '../contract/utils'

const baseWalletSaga = createWalletSaga({
  CHAIN_ID: +(process.env.REACT_APP_CHAIN_ID || 1)
})

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

  const { MANAToken, Marketplace, MarketplaceAdapter, Bids } = contractAddresses

  // TODO: VendorFactory.build().contractService.getAllowances()
  // TODO: VendorFactory.build().contractService.getApprovals()

  const authorization: AuthorizationsRequest = {
    allowances: {
      [Marketplace]: [MANAToken],
      [MarketplaceAdapter]: [MANAToken],
      [Bids]: [MANAToken]
    },
    approvals: {
      [Marketplace]: Object.keys(contractCategories).filter(
        key => contractCategories[key] !== NFTCategory.ART
      )
    }
  }

  yield put(fetchAuthorizationRequest(address, authorization))
}
