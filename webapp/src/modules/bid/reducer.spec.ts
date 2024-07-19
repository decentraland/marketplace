import { Bid } from '@dcl/schemas'
import { Asset } from '../asset/types'
import { clearBidError, fetchBidsByAssetFailure, fetchBidsByAssetRequest, fetchBidsByAssetSuccess } from './actions'
import { bidReducer, BidState, INITIAL_STATE } from './reducer'

let state: BidState

beforeEach(() => {
  state = INITIAL_STATE
})

describe('when clear bid error action is received', () => {
  beforeEach(() => {
    state.error = 'Some test error'
  })

  it('should set error field as null', () => {
    expect(bidReducer(state, clearBidError())).toEqual(expect.objectContaining({ error: null }))
  })
})

describe('when fetching bids by asset request action is received', () => {
  it('should set the action as loading', () => {
    const request = fetchBidsByAssetRequest({} as Asset)
    expect(bidReducer(state, request)).toEqual(expect.objectContaining({ loading: expect.arrayContaining([request]) }))
  })
})

describe('when fetching bids by asset failure action is received', () => {
  let error: string

  beforeEach(() => {
    error = 'Some test error'
    state.loading = [fetchBidsByAssetRequest({} as Asset)]
  })

  it('should add the error to the state', () => {
    expect(bidReducer(state, fetchBidsByAssetFailure({} as Asset, error))).toEqual(expect.objectContaining({ error }))
  })

  it('should remove the action from loading', () => {
    expect(bidReducer(state, fetchBidsByAssetFailure({} as Asset, error))).toEqual(expect.objectContaining({ loading: [] }))
  })
})

describe('when fetching bids by asset success action is received', () => {
  let bids: Bid[]

  beforeEach(() => {
    state.error = 'someError'
    state.loading = [fetchBidsByAssetRequest({} as Asset)]
    bids = [{ id: '1', bidAddress: '0x123' } as Bid]
  })

  it('should add the bids to the state', () => {
    expect(bidReducer(state, fetchBidsByAssetSuccess({} as Asset, bids))).toEqual(expect.objectContaining({ data: { '1': bids[0] } }))
  })

  it('should clear the error', () => {
    expect(bidReducer(state, fetchBidsByAssetSuccess({} as Asset, bids))).toEqual(expect.objectContaining({ loading: [] }))
  })

  it('should remove action from loading', () => {
    expect(bidReducer(state, fetchBidsByAssetSuccess({} as Asset, bids))).toEqual(expect.objectContaining({ error: null }))
  })
})
