import { RootState } from '../reducer'
import { CancelledTrade } from '../vendor/decentraland/cancelledTrades/types'
import { fetchCancelledTradesRequest } from './actions'
import { INITIAL_STATE } from './reducer'
import { getCancelledTrades, getCancelledTradesTotal, hasMoreCancelledTrades, isLoadingCancelledTrades } from './selectors'

let state: RootState
let trades: CancelledTrade[]

beforeEach(() => {
  trades = [{ id: 'a-trade-id' } as CancelledTrade]
  state = { cancelledTrades: { ...INITIAL_STATE, data: trades, total: 5 } } as unknown as RootState
})

describe('when getting the cancelled trades', () => {
  it('should return the loaded trades', () => {
    expect(getCancelledTrades(state)).toBe(trades)
  })

  it('should return the total of cancelled trades', () => {
    expect(getCancelledTradesTotal(state)).toBe(5)
  })
})

describe('when fewer trades than the total are loaded', () => {
  it('should report that there are more trades to load', () => {
    expect(hasMoreCancelledTrades(state)).toBe(true)
  })
})

describe('when every trade is loaded', () => {
  beforeEach(() => {
    state = { cancelledTrades: { ...state.cancelledTrades, total: 1 } } as unknown as RootState
  })

  it('should report that there are no more trades to load', () => {
    expect(hasMoreCancelledTrades(state)).toBe(false)
  })
})

describe('when a page of trades is being fetched', () => {
  beforeEach(() => {
    state = { cancelledTrades: { ...state.cancelledTrades, loading: [fetchCancelledTradesRequest(1)] } } as unknown as RootState
  })

  it('should report that trades are loading', () => {
    expect(isLoadingCancelledTrades(state)).toBe(true)
  })
})

describe('when no page of trades is being fetched', () => {
  it('should report that no trades are loading', () => {
    expect(isLoadingCancelledTrades(state)).toBe(false)
  })
})
