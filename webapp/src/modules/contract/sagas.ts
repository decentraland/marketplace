import { call, takeEvery, put } from '@redux-saga/core/effects'
import { VendorFactory, VendorName } from '../vendor'
import { Contract } from '../vendor/services'
import {
  fetchContractsFailure,
  fetchContractsSuccess,
  FETCH_CONTRACTS_REQUEST
} from './actions'

export function* contractSaga() {
  yield takeEvery(FETCH_CONTRACTS_REQUEST, handleFetchContractsRequest)
}

export function* handleFetchContractsRequest() {
  try {
    const vendors = Object.values(VendorName).map(VendorFactory.build)
    let contracts: Contract[] = []

    for (const vendor of vendors) {
      const { contractService } = vendor
      const moreContracts: Contract[] = yield call([
        contractService,
        contractService.getContracts
      ])
      contracts = [...contracts, ...moreContracts]
    }
    yield put(fetchContractsSuccess(contracts))
  } catch (error) {
    yield put(fetchContractsFailure(error.message))
  }
}
