import { call, takeEvery, put, select } from '@redux-saga/core/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import {
  FetchCollectionsSuccessAction,
  FetchSingleCollectionSuccessAction,
  FETCH_COLLECTIONS_SUCCESS,
  FETCH_SINGLE_COLLECTION_SUCCESS
} from '../collection/actions'
import { VendorFactory, VendorName } from '../vendor'
import { Contract } from '../vendor/services'
import {
  fetchContractsFailure,
  FetchContractsRequestAction,
  fetchContractsSuccess,
  FETCH_CONTRACTS_REQUEST,
  updateContracts
} from './actions'
import {
  getContract,
  getContracts,
  getHasIncludedMaticCollections
} from './selectors'

export function* contractSaga() {
  yield takeEvery(FETCH_CONTRACTS_REQUEST, handleFetchContractsRequest)
  yield takeEvery(FETCH_COLLECTIONS_SUCCESS, handleFetchCollectionsSuccess)
  yield takeEvery(
    FETCH_SINGLE_COLLECTION_SUCCESS,
    handleFetchSingleCollectionSuccess
  )
}

export function* handleFetchContractsRequest(
  action: FetchContractsRequestAction
) {
  const { includeMaticCollections, shouldFetchAuthorizations } = action.payload
  const hasIncludedMaticCollections: boolean = yield select(
    getHasIncludedMaticCollections
  )

  // Prevent the request to the nft server to be done more than once.
  if (hasIncludedMaticCollections) {
    yield put(
      fetchContractsFailure('Already fetched matic collection contracts')
    )
    return
  }

  try {
    const vendors = Object.values(VendorName).map(VendorFactory.build)
    let contracts: Contract[] = []

    for (const vendor of vendors) {
      const { contractService } = vendor
      const moreContracts: Contract[] = yield call(
        [contractService, contractService.getContracts],
        includeMaticCollections
      )
      contracts = [...contracts, ...moreContracts]
    }
    yield put(
      fetchContractsSuccess(
        includeMaticCollections,
        shouldFetchAuthorizations,
        contracts
      )
    )
  } catch (error) {
    yield put(
      fetchContractsFailure(
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}

function* handleFetchCollectionsSuccess(action: FetchCollectionsSuccessAction) {
  const { collections } = action.payload

  const contracts: Contract[] = yield select(getContracts)

  const collectionsByAddress = new Map(
    collections.map(collection => [collection.contractAddress, collection])
  )

  const updatedContracts = contracts.reduce((acc, contract) => {
    const collection = collectionsByAddress.get(contract.address)
    if (collection && contract.network === collection.network) {
      acc.push({ ...contract, name: collection.name })
    }
    return acc
  }, [] as Contract[])

  yield put(updateContracts(updatedContracts, false))
}

function* handleFetchSingleCollectionSuccess(
  action: FetchSingleCollectionSuccessAction
) {
  const { collection } = action.payload

  const contract: Contract | null = yield select(getContract, {
    name: collection.contractAddress,
    network: collection.network
  })

  if (contract) {
    console.log(contract)
    yield put(updateContracts([{ ...contract, name: collection.name }], false))
  }
}
