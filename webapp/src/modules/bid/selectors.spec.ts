import { AuthorizationStepStatus } from 'decentraland-ui'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { NFT } from '../nft/types'
import { RootState } from '../reducer'
import { placeBidRequest } from './actions'
import { getBidStatus } from './selectors'

let rootState: RootState

beforeEach(() => {
  rootState = {
    bid: {
      data: {},
      loading: [] as LoadingState,
      error: null
    }
  } as RootState
})

describe('when getting bid status', () => {
  describe('and a place bid request is loading', () => {
    it('should return WAITING status', () => {
      rootState.bid.loading = [placeBidRequest({} as NFT, 1, 2)]
      expect(getBidStatus(rootState)).toEqual(AuthorizationStepStatus.WAITING)
    })
  })

  describe('and there is an error in place bid flow', () => {
    it('should return ERROR status', () => {
      rootState.bid.error = 'Some test error'
      expect(getBidStatus(rootState)).toEqual(AuthorizationStepStatus.ERROR)
    })
  })

  describe('and there is no error and loading field is empty', () => {
    it('should return PENDING status', () => {
      rootState.bid.loading = []
      rootState.bid.error = null
      expect(getBidStatus(rootState)).toEqual(AuthorizationStepStatus.PENDING)
    })
  })
})
