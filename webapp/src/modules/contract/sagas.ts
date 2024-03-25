import { call, takeEvery, put, select } from '@redux-saga/core/effects'
import { Network, NFTCategory } from '@dcl/schemas'
import { fetchAuthorizationsRequest, GRANT_TOKEN_SUCCESS } from 'decentraland-dapps/dist/modules/authorization/actions'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { Authorization, AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { FetchTransactionSuccessAction, FETCH_TRANSACTION_SUCCESS } from 'decentraland-dapps/dist/modules/transaction/actions'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { CHANGE_ACCOUNT, CONNECT_WALLET_SUCCESS } from 'decentraland-dapps/dist/modules/wallet/actions'
import { ContractName } from 'decentraland-transactions'
import { isErrorWithMessage } from '../../lib/error'
import { getContractNames, VendorFactory, VendorName } from '../vendor'
import { Contract } from '../vendor/services'
import { getAddress } from '../wallet/selectors'
import { fetchContractsFailure, fetchContractsSuccess, FETCH_CONTRACTS_REQUEST, FETCH_CONTRACTS_SUCCESS, resetHasFetched } from './actions'
import { getContract, getContracts, getHasFetched } from './selectors'
import { getAuthorizationKey } from './utils'

export function* contractSaga() {
  yield takeEvery(FETCH_CONTRACTS_REQUEST, handleFetchContractsRequest)
  yield takeEvery(FETCH_CONTRACTS_SUCCESS, handleFetchContractsSuccess)
  yield takeEvery(CHANGE_ACCOUNT, handleChangeAccount)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeEvery(FETCH_TRANSACTION_SUCCESS, handleFetchTransactionSuccess)
}

export function* handleFetchContractsRequest() {
  try {
    const hasFetched: boolean = yield select(getHasFetched)

    if (hasFetched) {
      throw new Error('Contracts have already been fetched')
    }

    const vendors = Object.values(VendorName).map(v => VendorFactory.build(v))
    let contracts: Contract[] = []

    for (const vendor of vendors) {
      const { contractService } = vendor
      const moreContracts: Contract[] = yield call([contractService, 'getContracts'])
      contracts = [...contracts, ...moreContracts]
    }
    yield put(fetchContractsSuccess(contracts))
  } catch (error) {
    yield put(fetchContractsFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

export function* handleFetchContractsSuccess() {
  const contracts: Contract[] = yield select(getContracts)
  const address: string | undefined = yield select(getAddress)

  if (!address) {
    console.warn('Not fetching authorizations because the user is not connected')
    return
  }

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

  let authorizations: Authorization[] = []

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
    const marketplace: Contract = contract.network === Network.MATIC ? marketplaceMatic : marketplaceEthereum

    if (contract.category === NFTCategory.WEARABLE || contract.category === NFTCategory.EMOTE) {
      // just add the authorizations for the contracts that are not already in the array
      if (!authorizations.some(authorization => authorization.contractAddress === contract.address)) {
        authorizations.push({
          address,
          authorizedAddress: marketplace.address,
          contractAddress: contract.address,
          contractName: contract.network === Network.MATIC ? ContractName.ERC721CollectionV2 : ContractName.ERC721,
          chainId: contract.chainId,
          type: AuthorizationType.APPROVAL
        })
      }
    } else {
      authorizations.push({
        address,
        authorizedAddress: marketplace.address,
        contractAddress: contract.address,
        contractName: contract.network === Network.MATIC ? ContractName.ERC721CollectionV2 : ContractName.ERC721,
        chainId: contract.chainId,
        type: AuthorizationType.APPROVAL
      })
    }

    // add authorizations for the rentals contract for the land and estate registries
    if (contract.category === NFTCategory.PARCEL || contract.category === NFTCategory.ESTATE) {
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

  // Remove the authorizations that are already in the state.
  // This prevents authorizations from being duplicated in the state, as well
  // as preventing unnecessary extra calls.
  const storeAuthorizations: Authorization[] = yield select(getAuthorizations)

  const storeAuthorizationsMap = storeAuthorizations.reduce(
    (map, authorization) => map.set(getAuthorizationKey(authorization), authorization),
    new Map<string, Authorization>()
  )

  authorizations = authorizations.filter(authorization => !storeAuthorizationsMap.has(getAuthorizationKey(authorization)))

  yield put(fetchAuthorizationsRequest(authorizations))
}

function* handleChangeAccount() {
  yield put(resetHasFetched())
}

function* handleConnectWalletSuccess() {
  yield put(resetHasFetched())
}

function* handleFetchTransactionSuccess(action: FetchTransactionSuccessAction) {
  const { transaction } = action.payload

  if (transaction.actionType === GRANT_TOKEN_SUCCESS) {
    const authorization: Authorization = (transaction.payload as { authorization: Authorization }).authorization
    yield put(fetchAuthorizationsRequest([authorization]))
  }
}
