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

describe('when getting the bid status', () => {
  describe('and a place bid request is loading', () => {
    beforeEach(() => {
      rootState.bid.loading = [placeBidRequest({} as NFT, 1, 2)]
    })

    it('should return WAITING status', () => {
      expect(getBidStatus(rootState)).toEqual(AuthorizationStepStatus.WAITING)
    })
  })

  describe('and there is an error in the place bid flow', () => {
    beforeEach(() => {
      rootState.bid.error = 'Some test error'
    })

    it('should return ERROR status', () => {
      expect(getBidStatus(rootState)).toEqual(AuthorizationStepStatus.ERROR)
    })
  })

  describe('and there is no error and the loading field is empty', () => {
    beforeEach(() => {
      rootState.bid.loading = []
      rootState.bid.error = null
    })

    it('should return PENDING status', () => {
      expect(getBidStatus(rootState)).toEqual(AuthorizationStepStatus.PENDING)
    })
  })
})
