import { Order } from '@dcl/schemas'
import { RootState } from '../reducer'
import { createSelector } from 'reselect'
import { getCurrentNFT } from '../nft/selectors'
import { NFT } from '../nft/types'
import { OrderState } from './reducer'
import { getActiveOrder } from './utils'

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
