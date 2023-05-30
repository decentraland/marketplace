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

describe('when getting buy item status', () => {
  describe('and a execute order request is loading', () => {
    it('should return WAITING status', () => {
      rootState.order.loading = [executeOrderRequest({} as Order, {} as NFT)]
      expect(getBuyItemStatus(rootState)).toEqual(AuthorizationStepStatus.WAITING)
    })
  })

  describe('and there is an error in buy item flow', () => {
    it('should return ERROR status', () => {
      rootState.order.error = 'Some test error'
      expect(getBuyItemStatus(rootState)).toEqual(AuthorizationStepStatus.ERROR)
    })
  })

  describe('and there is no error and loading field is empty', () => {
    it('should return PENDING status', () => {
      rootState.order.loading = []
      rootState.order.error = null
      expect(getBuyItemStatus(rootState)).toEqual(AuthorizationStepStatus.PENDING)
    })
  })
})
