import { Order } from '@dcl/schemas'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { AuthorizationStepStatus } from 'decentraland-ui'
import { NFT } from '../nft/types'
import { RootState } from '../reducer'
import { createOrderRequest, executeOrderRequest } from './actions'
import { getBuyItemStatus, getSellItemStatus } from './selectors'

let rootState: RootState

beforeEach(() => {
  rootState = {
    order: {
      data: {},
      loading: [] as LoadingState,
      error: null
    }
  } as RootState
})

describe('when getting the buy item status', () => {
  describe('and an execute order request is loading', () => {
    beforeEach(() => {
      rootState.order.loading = [executeOrderRequest({} as Order, {} as NFT)]
    })

    it('should return WAITING status', () => {
      expect(getBuyItemStatus(rootState)).toEqual(AuthorizationStepStatus.WAITING)
    })
  })

  describe('and there is an error in the buy item flow', () => {
    beforeEach(() => {
      rootState.order.error = 'Some test error'
    })

    it('should return ERROR status', () => {
      expect(getBuyItemStatus(rootState)).toEqual(AuthorizationStepStatus.ERROR)
    })
  })

  describe('and there is no error and the loading field is empty', () => {
    beforeEach(() => {
      rootState.order.loading = []
      rootState.order.error = null
    })

    it('should return PENDING status', () => {
      expect(getBuyItemStatus(rootState)).toEqual(AuthorizationStepStatus.PENDING)
    })
  })
})

describe('when getting the sell item status', () => {
  describe('and a create order request is loading', () => {
    beforeEach(() => {
      rootState.order.loading = [createOrderRequest({} as NFT, 100, 0)]
    })

    it('should return WAITING status', () => {
      expect(getSellItemStatus(rootState)).toEqual(AuthorizationStepStatus.WAITING)
    })
  })

  describe('and there is an error in the sell item flow', () => {
    beforeEach(() => {
      rootState.order.error = 'Some test error'
    })

    it('should return ERROR status', () => {
      expect(getSellItemStatus(rootState)).toEqual(AuthorizationStepStatus.ERROR)
    })
  })

  describe('and there is no error and the loading field is empty', () => {
    beforeEach(() => {
      rootState.order.loading = []
      rootState.order.error = null
    })

    it('should return PENDING status', () => {
      expect(getSellItemStatus(rootState)).toEqual(AuthorizationStepStatus.PENDING)
    })
  })
})
