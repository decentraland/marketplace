import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { select, take } from 'redux-saga/effects'
import { FETCH_CONTRACTS_REQUEST, FETCH_CONTRACTS_SUCCESS } from './actions'
import { getContracts, getLoading } from './selectors'

export function* getOrWaitForContracts() {
  const loading: LoadingState = yield select(getLoading)

  if (isLoadingType(loading, FETCH_CONTRACTS_REQUEST)) {
    yield take(FETCH_CONTRACTS_SUCCESS)
  }
  const contracts: ReturnType<typeof getContracts> = yield select(getContracts)
  return contracts
}
