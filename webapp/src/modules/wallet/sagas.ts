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
import { contractAddresses } from '../contract/utils'

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

  const {
    MANAToken,
    Marketplace,
    LANDRegistry,
    EstateRegistry,
    ExclusiveMasksCollection,
    Halloween2019Collection,
    Xmas2019Collection,
    MCHCollection,
    CommunityContestCollection,
    DCLLaunchCollection,
    DCGCollection,
    DCLRegistrar,
    Bids
  } = contractAddresses

  const authorization: AuthorizationsRequest = {
    allowances: {
      [Marketplace]: [MANAToken],
      [Bids]: [MANAToken]
    },
    approvals: {
      [Marketplace]: [
        LANDRegistry,
        EstateRegistry,
        ExclusiveMasksCollection,
        Halloween2019Collection,
        Xmas2019Collection,
        MCHCollection,
        CommunityContestCollection,
        DCLLaunchCollection,
        DCGCollection,
        DCLRegistrar
      ]
    }
  }

  yield put(fetchAuthorizationRequest(address, authorization))
}
