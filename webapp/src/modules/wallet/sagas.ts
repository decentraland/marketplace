import { takeEvery, all, put, select, call } from 'redux-saga/effects'
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
import { config } from '../../config'
import { getContract, getContracts } from '../contract/selectors'
import { getOrWaitForContracts } from '../contract/utils'
import { Contract } from '../vendor/services'
import { getContractNames } from '../vendor'
import { TRANSACTIONS_API_URL } from './utils'

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

  const contracts: ReturnType<typeof getContracts> = yield call(
    getOrWaitForContracts
  )
  const contractNames = getContractNames()

  const marketplaceEthereum: Contract = yield select(getContract, {
    name: contractNames.MARKETPLACE,
    network: Network.ETHEREUM
  })

  const marketplaceMatic: Contract = yield select(getContract, {
    name: contractNames.MARKETPLACE,
    network: Network.MATIC
  })

  const legacyMarketplaceMatic: Contract = yield select(getContract, {
    name: contractNames.LEGACY_MARKETPLACE,
    network: Network.MATIC
  })

  const bidsEthereum: Contract = yield select(getContract, {
    name: contractNames.BIDS,
    network: Network.ETHEREUM
  })

  const bidsMatic: Contract = yield select(getContract, {
    name: contractNames.BIDS,
    network: Network.MATIC
  })

  const manaEthereum: Contract = yield select(getContract, {
    name: contractNames.MANA,
    network: Network.ETHEREUM
  })

  const manaMatic: Contract = yield select(getContract, {
    name: contractNames.MANA,
    network: Network.MATIC
  })

  const collectionStore: Contract = yield select(getContract, {
    name: contractNames.COLLECTION_STORE,
    network: Network.MATIC
  })

  const rentals: Contract = yield select(getContract, {
    name: contractNames.RENTALS,
    network: Network.ETHEREUM
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

  authorizations.push({
    address,
    authorizedAddress: rentals.address,
    contractAddress: manaEthereum.address,
    contractName: ContractName.MANAToken,
    chainId: manaEthereum.chainId,
    type: AuthorizationType.ALLOWANCE
  })

  for (const contract of contracts.filter(c => c.category !== null)) {
    // If the contract is a partner we might need to use a different contract name. See PR #680
    const marketplace: Contract = yield select(getContract, {
      name: contractNames.MARKETPLACE,
      network: contract.network
    })

    if (
      contract.category === NFTCategory.WEARABLE ||
      contract.category === NFTCategory.EMOTE
    ) {
      // just add the authorizations for the contracts that are not already in the array
      if (
        !authorizations.some(
          authorization => authorization.contractAddress === contract.address
        )
      ) {
        authorizations.push({
          address,
          authorizedAddress: marketplace.address,
          contractAddress: contract.address,
          contractName:
            contract.network === Network.MATIC
              ? ContractName.ERC721CollectionV2
              : ContractName.ERC721,
          chainId: contract.chainId,
          type: AuthorizationType.APPROVAL
        })
      }
    } else {
      authorizations.push({
        address,
        authorizedAddress: marketplace.address,
        contractAddress: contract.address,
        contractName:
          contract.network === Network.MATIC
            ? ContractName.ERC721CollectionV2
            : ContractName.ERC721,
        chainId: contract.chainId,
        type: AuthorizationType.APPROVAL
      })
    }

    // add authorizations for the rentals contract for the land and estate registries
    if (
      contract.category === NFTCategory.PARCEL ||
      contract.category === NFTCategory.ESTATE
    ) {
      authorizations.push({
        address,
        authorizedAddress: rentals.address,
        contractAddress: contract.address,
        contractName: ContractName.ERC721,
        chainId: contract.chainId,
        type: AuthorizationType.APPROVAL
      })
    }
  }

  yield put(fetchAuthorizationsRequest(authorizations))
}
