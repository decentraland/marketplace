import { RootState } from '../reducer'
import { CancelledTrade } from '../vendor/decentraland/cancelledTrades/types'
import { fetchMoreCancelledTradesRequest } from './actions'
import { INITIAL_STATE } from './reducer'
import { getCancelledTrades, getCancelledTradesTotal, hasMoreCancelledTrades, isLoadingMoreCancelledTrades } from './selectors'

let state: RootState
let trades: CancelledTrade[]

beforeEach(() => {
  trades = [{ id: 'a-trade-id' } as CancelledTrade]
  state = {
    cancelledTrades: { ...INITIAL_STATE, address: '0xabc', data: trades, total: 5 },
    wallet: { data: { address: '0xABC' } }
  } as unknown as RootState
})

describe('when the trades belong to the connected wallet', () => {
  it('should return the cancelled trades', () => {
    expect(getCancelledTrades(state)).toBe(trades)
  })

  it('should return the total of cancelled trades', () => {
    expect(getCancelledTradesTotal(state)).toBe(5)
  })

  describe('and fewer trades than the total are loaded', () => {
    it('should report that there are more trades to load', () => {
      expect(hasMoreCancelledTrades(state)).toBe(true)
    })
  })

  describe('and every trade is loaded', () => {
    beforeEach(() => {
      state = { ...state, cancelledTrades: { ...state.cancelledTrades, total: 1 } } as RootState
    })

    it('should report that there are no more trades to load', () => {
      expect(hasMoreCancelledTrades(state)).toBe(false)
    })
  })
})

describe('when the next page of trades is being fetched', () => {
  beforeEach(() => {
    state = {
      ...state,
      cancelledTrades: { ...state.cancelledTrades, loading: [fetchMoreCancelledTradesRequest('0xabc', 1)] }
    } as RootState
  })

  it('should report that more trades are loading', () => {
    expect(isLoadingMoreCancelledTrades(state)).toBe(true)
  })
})

describe('when no page of trades is being fetched', () => {
  it('should report that no more trades are loading', () => {
    expect(isLoadingMoreCancelledTrades(state)).toBe(false)
  })
})

describe('when the trades belong to another wallet', () => {
  beforeEach(() => {
    state = { ...state, wallet: { data: { address: '0xdef' } } } as unknown as RootState
  })

  it('should return no cancelled trades', () => {
    expect(getCancelledTrades(state)).toEqual([])
  })

  it('should return a total of zero', () => {
    expect(getCancelledTradesTotal(state)).toBe(0)
  })
})

describe('when there is no connected wallet', () => {
  beforeEach(() => {
    state = { ...state, wallet: { data: null } } as unknown as RootState
  })

  it('should return no cancelled trades', () => {
    expect(getCancelledTrades(state)).toEqual([])
  })
})
