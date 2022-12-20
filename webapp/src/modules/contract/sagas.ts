import { call, takeEvery, put, select } from '@redux-saga/core/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { VendorFactory, VendorName } from '../vendor'
import { Contract } from '../vendor/services'
import {
  fetchContractsFailure,
  FetchContractsRequestAction,
  fetchContractsSuccess,
  FETCH_CONTRACTS_REQUEST
} from './actions'
import { getHasIncludedMaticCollections } from './selectors'

export function* contractSaga() {
  yield takeEvery(FETCH_CONTRACTS_REQUEST, handleFetchContractsRequest)
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
