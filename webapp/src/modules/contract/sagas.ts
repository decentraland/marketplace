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
    const hasFetched: boolean = (yield select(getHasFetched)) as Awaited<ReturnType<typeof getHasFetched>>

    if (hasFetched) {
      throw new Error('Contracts have already been fetched')
    }

    const vendors = Object.values(VendorName).map(v => VendorFactory.build(v))
    let contracts: Contract[] = []

    for (const vendor of vendors) {
      const { contractService } = vendor
      const moreContracts: Contract[] = (yield call([contractService, 'getContracts'])) as Awaited<
        ReturnType<typeof contractService.getContracts>
      >
      contracts = [...contracts, ...moreContracts]
    }
    yield put(fetchContractsSuccess(contracts))
  } catch (error) {
    yield put(fetchContractsFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

export function* handleFetchContractsSuccess() {
  const contracts: Contract[] = (yield select(getContracts)) as Awaited<ReturnType<typeof getContracts>>
  const address: string | undefined = (yield select(getAddress)) as Awaited<ReturnType<typeof getAddress>>

  if (!address) {
    console.warn('Not fetching authorizations because the user is not connected')
    return
  }

  const contractNames = getContractNames()

  const marketplaceEthereum: Contract | null = (yield select(getContract, {
    name: contractNames.MARKETPLACE,
    network: Network.ETHEREUM
  })) as ReturnType<typeof getContract>

  const marketplaceMatic: Contract | null = (yield select(getContract, {
    name: contractNames.MARKETPLACE,
    network: Network.MATIC
  })) as ReturnType<typeof getContract>

  const legacyMarketplaceMatic: Contract | null = (yield select(getContract, {
    name: contractNames.LEGACY_MARKETPLACE,
    network: Network.MATIC
  })) as ReturnType<typeof getContract>

  const bidsEthereum: Contract | null = (yield select(getContract, {
    name: contractNames.BIDS,
    network: Network.ETHEREUM
  })) as ReturnType<typeof getContract>

  const bidsMatic: Contract | null = (yield select(getContract, {
    name: contractNames.BIDS,
    network: Network.MATIC
  })) as ReturnType<typeof getContract>

  const manaEthereum: Contract | null = (yield select(getContract, {
    name: contractNames.MANA,
    network: Network.ETHEREUM
  })) as ReturnType<typeof getContract>

  const manaMatic: Contract | null = (yield select(getContract, {
    name: contractNames.MANA,
    network: Network.MATIC
  })) as ReturnType<typeof getContract>

  const collectionStore: Contract | null = (yield select(getContract, {
    name: contractNames.COLLECTION_STORE,
    network: Network.MATIC
  })) as ReturnType<typeof getContract>

  const rentals: Contract | null = (yield select(getContract, {
    name: contractNames.RENTALS,
    network: Network.ETHEREUM
  })) as ReturnType<typeof getContract>

  let authorizations: Authorization[] = []

  if (marketplaceEthereum && manaEthereum) {
    authorizations.push({
      address,
      authorizedAddress: marketplaceEthereum.address,
      contractAddress: manaEthereum.address,
      contractName: ContractName.MANAToken,
      chainId: manaEthereum.chainId,
      type: AuthorizationType.ALLOWANCE
    })
  }

  if (marketplaceMatic && manaMatic) {
    authorizations.push({
      address,
      authorizedAddress: marketplaceMatic.address,
      contractAddress: manaMatic.address,
      contractName: ContractName.MANAToken,
      chainId: manaMatic.chainId,
      type: AuthorizationType.ALLOWANCE
    })
  }

  if (legacyMarketplaceMatic && manaMatic) {
    authorizations.push({
      address,
      authorizedAddress: legacyMarketplaceMatic.address,
      contractAddress: manaMatic.address,
      contractName: ContractName.MANAToken,
      chainId: manaMatic.chainId,
      type: AuthorizationType.ALLOWANCE
    })
  }

  if (bidsEthereum && manaEthereum) {
    authorizations.push({
      address,
      authorizedAddress: bidsEthereum.address,
      contractAddress: manaEthereum.address,
      contractName: ContractName.MANAToken,
      chainId: manaEthereum.chainId,
      type: AuthorizationType.ALLOWANCE
    })
  }

  if (bidsMatic && manaMatic) {
    authorizations.push({
      address,
      authorizedAddress: bidsMatic.address,
      contractAddress: manaMatic.address,
      contractName: ContractName.MANAToken,
      chainId: manaMatic.chainId,
      type: AuthorizationType.ALLOWANCE
    })
  }

  if (collectionStore && manaMatic) {
    authorizations.push({
      address,
      authorizedAddress: collectionStore.address,
      contractAddress: manaMatic.address,
      contractName: ContractName.MANAToken,
      chainId: manaMatic.chainId,
      type: AuthorizationType.ALLOWANCE
    })
  }

  if (rentals && manaEthereum) {
    authorizations.push({
      address,
      authorizedAddress: rentals.address,
      contractAddress: manaEthereum.address,
      contractName: ContractName.MANAToken,
      chainId: manaEthereum.chainId,
      type: AuthorizationType.ALLOWANCE
    })
  }

  for (const contract of contracts.filter(c => c.category !== null)) {
    // If the contract is a partner we might need to use a different contract name. See PR #680
    const marketplace: Contract | null = contract.network === Network.MATIC ? marketplaceMatic : marketplaceEthereum

    if ((contract.category === NFTCategory.WEARABLE || contract.category === NFTCategory.EMOTE) && marketplace) {
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
    } else if (marketplace) {
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
    if ((contract.category === NFTCategory.PARCEL || contract.category === NFTCategory.ESTATE) && rentals) {
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
  const storeAuthorizations: Authorization[] = (yield select(getAuthorizations)) as ReturnType<typeof getAuthorizations>

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
