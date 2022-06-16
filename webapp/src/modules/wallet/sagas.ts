import { takeEvery, all, put } from 'redux-saga/effects'
import { Network, NFTCategory } from '@dcl/schemas'
import { ContractName } from 'decentraland-transactions'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_SUCCESS,
  ChangeAccountAction,
  ChangeNetworkAction,
  CHANGE_ACCOUNT,
  CHANGE_NETWORK
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { fetchAuthorizationsRequest } from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { getContractNames } from '../vendor'
import { contracts, getContract } from '../contract/utils'
import { isPartner } from '../vendor/utils'
import { TRANSACTIONS_API_URL } from './utils'
import { config } from '../../config'

const baseWalletSaga = createWalletSaga({
  CHAIN_ID: Number(config.get('CHAIN_ID')!),
  POLL_INTERVAL: 0,
  TRANSACTIONS_API_URL
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

  const contractNames = getContractNames()

  const marketplaceEthereum = getContract({
    name: contractNames.MARKETPLACE,
    network: Network.ETHEREUM
  })

  const marketplaceMatic = getContract({
    name: contractNames.MARKETPLACE,
    network: Network.MATIC
  })

  const legacyMarketplaceMatic = getContract({
    name: contractNames.LEGACY_MARKETPLACE,
    network: Network.MATIC
  })

  const marketplaceAdapter = getContract({
    name: contractNames.MARKETPLACE_ADAPTER
  })

  const bidsEthereum = getContract({
    name: contractNames.BIDS,
    network: Network.ETHEREUM
  })

  const bidsMatic = getContract({
    name: contractNames.BIDS,
    network: Network.MATIC
  })

  const manaEthereum = getContract({
    name: contractNames.MANA,
    network: Network.ETHEREUM
  })

  const manaMatic = getContract({
    name: contractNames.MANA,
    network: Network.MATIC
  })

  const collectionStore = getContract({
    name: contractNames.COLLECTION_STORE,
    network: Network.MATIC
  })

  const authorizations: Authorization[] = []

  authorizations.push({
    address,
    authorizedAddress: marketplaceEthereum.address,
    contractAddress: manaEthereum.address,
    contractName: ContractName.MANAToken,
    chainId: manaEthereum.chainId,
    type: AuthorizationType.ALLOWANCE
  })

  authorizations.push({
    address,
    authorizedAddress: marketplaceMatic.address,
    contractAddress: manaMatic.address,
    contractName: ContractName.MANAToken,
    chainId: manaMatic.chainId,
    type: AuthorizationType.ALLOWANCE
  })

  authorizations.push({
    address,
    authorizedAddress: legacyMarketplaceMatic.address,
    contractAddress: manaMatic.address,
    contractName: ContractName.MANAToken,
    chainId: manaMatic.chainId,
    type: AuthorizationType.ALLOWANCE
  })

  authorizations.push({
    address,
    authorizedAddress: marketplaceAdapter.address,
    contractAddress: manaEthereum.address,
    contractName: ContractName.MANAToken,
    chainId: manaEthereum.chainId,
    type: AuthorizationType.ALLOWANCE
  })

  authorizations.push({
    address,
    authorizedAddress: bidsEthereum.address,
    contractAddress: manaEthereum.address,
    contractName: ContractName.MANAToken,
    chainId: manaEthereum.chainId,
    type: AuthorizationType.ALLOWANCE
  })

  authorizations.push({
    address,
    authorizedAddress: bidsMatic.address,
    contractAddress: manaMatic.address,
    contractName: ContractName.MANAToken,
    chainId: manaMatic.chainId,
    type: AuthorizationType.ALLOWANCE
  })

  authorizations.push({
    address,
    authorizedAddress: collectionStore.address,
    contractAddress: manaMatic.address,
    contractName: ContractName.MANAToken,
    chainId: manaMatic.chainId,
    type: AuthorizationType.ALLOWANCE
  })

  for (const contract of contracts.filter(c => c.category !== null)) {
    const marketplace = getContract({
      name:
        contract.vendor && isPartner(contract.vendor)
          ? contractNames.MARKETPLACE_ADAPTER
          : contractNames.MARKETPLACE,
      network: contract.network
    })!

    // Skip SuperRare contract since it's not ERC721 compliant (lacks approveForAll)
    if (contract.name === contractNames.SUPER_RARE) {
      continue
    }

    authorizations.push({
      address,
      authorizedAddress: marketplace.address,
      contractAddress: contract.address,
      contractName:
        contract.category === NFTCategory.WEARABLE &&
        contract.network === Network.MATIC
          ? ContractName.ERC721CollectionV2
          : ContractName.ERC721,
      chainId: contract.chainId,
      type: AuthorizationType.APPROVAL
    })
  }

  yield put(fetchAuthorizationsRequest(authorizations))
}
