import { takeEvery, all, put, select } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_SUCCESS,
  ChangeAccountAction,
  ChangeNetworkAction,
  CHANGE_ACCOUNT,
  CHANGE_NETWORK
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { getChainId } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { fetchAuthorizationsRequest } from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { getChainConfiguration } from 'decentraland-dapps/dist/lib/chainConfiguration'

import { NFTCategory } from '../nft/types'
import {
  contractAddresses,
  contractCategories,
  contractNetworks
} from '../contract/utils'
import { Network } from '@dcl/schemas'

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

  const chainId: ReturnType<typeof getChainId> = yield select(getChainId)
  if (chainId) {
    const config = getChainConfiguration(chainId)

    const authorizations: Authorization[] = []

    authorizations.push({
      address,
      authorizedAddress: Marketplace,
      tokenAddress: MANAToken,
      type: AuthorizationType.ALLOWANCE,
      chainId: config.networkMapping[Network.ETHEREUM]
    })

    authorizations.push({
      address,
      authorizedAddress: MarketplaceAdapter,
      tokenAddress: MANAToken,
      type: AuthorizationType.ALLOWANCE,
      chainId: config.networkMapping[Network.ETHEREUM]
    })

    authorizations.push({
      address,
      authorizedAddress: Bids,
      tokenAddress: MANAToken,
      type: AuthorizationType.ALLOWANCE,
      chainId: config.networkMapping[Network.ETHEREUM]
    })

    const contracts = Object.keys(contractCategories).filter(
      key => contractCategories[key] !== NFTCategory.ART
    )

    for (const contract of contracts) {
      authorizations.push({
        address,
        authorizedAddress: Marketplace,
        tokenAddress: contract,
        type: AuthorizationType.APPROVAL,
        chainId: config.networkMapping[contractNetworks[contract]]
      })
    }

    yield put(fetchAuthorizationsRequest(authorizations))
  } else {
    console.error('Error: undefined chainId')
  }
}
