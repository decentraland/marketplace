import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { itemSaga } from './sagas'
import { buyItemRequest, buyItemFailure } from './actions'
import { getWallet } from '../wallet/selectors'
import { Item } from '@dcl/schemas'

const item = {
  itemId: 'anItemId',
  price: '324234'
} as Item

describe('when handling the buy items request action', () => {
  describe("when there's no wallet loaded in the state", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(itemSaga)
        .provide([[matchers.select(getWallet), null]])
        .put(buyItemRequest(item))
        .dispatch(buyItemFailure('A defined wallet is required to buy an item'))
        .run()
    })
  })

  // describe("when there's no address set for the collection store contract", () => {
  //   it('should dispatch an action signaling the failure of the action handling', () => {})
  // })

  // describe("when there's building the store contract fails", () => {
  //   it('should dispatch an action signaling the failure of the action handling', () => {})
  // })

  // describe("when there's no address set for the collection store contract", () => {
  //   it('should dispatch an action signaling the failure of the action handling', () => {})
  // })

  // describe('when sending the meta transaction fails', () => {
  //   it('should dispatch an action signaling the failure of the action handling', () => {})
  // })

  // describe('when sending the meta transaction', () => {
  //   it('should build the contract')
  // })
})
