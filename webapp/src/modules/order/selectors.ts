import { Order } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../reducer'
import { createSelector } from 'reselect'
import { getCurrentNFT } from '../nft/selectors'
import { NFT } from '../nft/types'
import { OrderState } from './reducer'
import { getActiveOrder } from './utils'
import { EXECUTE_ORDER_REQUEST } from './actions'
import { AuthorizationStepStatus } from '../../components/HOC/withAuthorizedAction/AuthorizationModal'

export const getState = (state: RootState) => state.order
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error
export const getCurrentOrder = createSelector<
  RootState,
  NFT | null,
  OrderState['data'],
  Order | null
>(
  state => getCurrentNFT(state),
  state => getData(state),
  (nft, orders) => getActiveOrder(nft, orders)
)

export const getBuyItemStatus = (state: RootState) => {
  if (isLoadingType(getLoading(state), EXECUTE_ORDER_REQUEST)) {
    return AuthorizationStepStatus.WAITING
  }

  if (getError(state)) {
    return AuthorizationStepStatus.ERROR
  }

  return AuthorizationStepStatus.PENDING
}
