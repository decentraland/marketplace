import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { AuthorizationStepStatus } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { RootState } from '../reducer'
import { PLACE_BID_REQUEST } from './actions'

export const getState = (state: RootState) => state.bid
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error
export const getBidStatus = (state:RootState) => {
  if (isLoadingType(getLoading(state), PLACE_BID_REQUEST)) {
    return AuthorizationStepStatus.WAITING
  }

  if (getError(state)) {
    return AuthorizationStepStatus.ERROR
  }

  return AuthorizationStepStatus.PENDING
}
