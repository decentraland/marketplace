import { Network } from '@dcl/schemas'
import { disconnectWalletSuccess } from 'decentraland-dapps/dist/modules/wallet/actions'
import { CancelledTrade } from '../vendor/decentraland/cancelledTrades/types'
import { fetchCancelledTradesFailure, fetchCancelledTradesRequest, fetchCancelledTradesSuccess } from './actions'
import { cancelledTradesReducer, CancelledTradesState, INITIAL_STATE } from './reducer'

let state: CancelledTradesState
let address: string

beforeEach(() => {
  state = { ...INITIAL_STATE }
  address = '0xAbC0000000000000000000000000000000000001'
})

describe('when the fetch cancelled trades request action is received', () => {
  let request: ReturnType<typeof fetchCancelledTradesRequest>

  beforeEach(() => {
    request = fetchCancelledTradesRequest(address)
  })

  it('should add the action to the loading state', () => {
    expect(cancelledTradesReducer(state, request).loading).toEqual([request])
  })
})

describe('when the fetch cancelled trades success action is received', () => {
  let trades: CancelledTrade[]
  let newState: CancelledTradesState

  beforeEach(() => {
    trades = [{ id: 'a-trade-id', network: Network.MATIC } as CancelledTrade]
    state = { ...state, loading: [fetchCancelledTradesRequest(address)], error: 'an error' }
    newState = cancelledTradesReducer(state, fetchCancelledTradesSuccess(address, trades, 3))
  })

  it('should store the trades, the total and the lowercased address they belong to', () => {
    expect(newState).toEqual(expect.objectContaining({ data: trades, total: 3, address: address.toLowerCase() }))
  })

  it('should clear the loading state and the error', () => {
    expect(newState).toEqual(expect.objectContaining({ loading: [], error: null }))
  })
})

describe('when the fetch cancelled trades failure action is received', () => {
  let newState: CancelledTradesState

  beforeEach(() => {
    state = { ...state, loading: [fetchCancelledTradesRequest(address)] }
    newState = cancelledTradesReducer(state, fetchCancelledTradesFailure(address, 'an error'))
  })

  it('should store the error and clear the loading state', () => {
    expect(newState).toEqual(expect.objectContaining({ error: 'an error', loading: [] }))
  })
})

describe('when the wallet is disconnected', () => {
  beforeEach(() => {
    state = { ...state, address: address.toLowerCase(), data: [{ id: 'a-trade-id' } as CancelledTrade], total: 1 }
  })

  it('should reset the state', () => {
    expect(cancelledTradesReducer(state, disconnectWalletSuccess())).toEqual(INITIAL_STATE)
  })
})
