import { Order } from "@dcl/schemas"
import { LoadingState } from "decentraland-dapps/dist/modules/loading/reducer"
import { executeOrderRequest } from "./actions"
import { NFT } from "../nft/types"
import { RootState } from "../reducer"
import { getBuyItemStatus } from "./selectors"
import { AuthorizationStepStatus } from "decentraland-ui"

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
