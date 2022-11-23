import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { race, select, take } from 'redux-saga/effects'
import {
  FetchContractsFailureAction,
  FetchContractsSuccessAction,
  FETCH_CONTRACTS_FAILURE,
  FETCH_CONTRACTS_REQUEST,
  FETCH_CONTRACTS_SUCCESS
} from './actions'
import { getContracts, getLoading } from './selectors'

export function* getOrWaitForContracts() {
  const loading: LoadingState = yield select(getLoading)

  if (isLoadingType(loading, FETCH_CONTRACTS_REQUEST)) {
    const result: {
      success: FetchContractsSuccessAction
      failure: FetchContractsFailureAction
    } = yield race({
      success: take(FETCH_CONTRACTS_SUCCESS),
      failure: take(FETCH_CONTRACTS_FAILURE)
    })
    if (result.failure) {
      throw new Error(`Could not load contracts`)
    }
  }
  const contracts: ReturnType<typeof getContracts> = yield select(getContracts)
  return contracts
}
