import { ChainId, Item, Network } from '@dcl/schemas'
import { disconnectWalletSuccess } from 'decentraland-dapps/dist/modules/wallet/actions'
import { placeBidSuccess } from '../bid/actions'
import { NFT } from '../nft/types'
import { createOrderSuccess } from '../order/actions'
import { CancelledTrade, CancelledTradeType } from '../vendor/decentraland/cancelledTrades/types'
import {
  fetchCancelledTradesFailure,
  fetchCancelledTradesRequest,
  fetchCancelledTradesSuccess,
  fetchMoreCancelledTradesFailure,
  fetchMoreCancelledTradesRequest,
  fetchMoreCancelledTradesSuccess
} from './actions'
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

describe('when the fetch more cancelled trades request action is received', () => {
  let request: ReturnType<typeof fetchMoreCancelledTradesRequest>
  let newState: CancelledTradesState

  beforeEach(() => {
    request = fetchMoreCancelledTradesRequest(address, 100)
    state = { ...state, error: 'an error' }
    newState = cancelledTradesReducer(state, request)
  })

  it('should add the action to the loading state and clear the error', () => {
    expect(newState).toEqual(expect.objectContaining({ loading: [request], error: null }))
  })
})

describe('when the fetch more cancelled trades success action is received', () => {
  let loadedTrades: CancelledTrade[]
  let pageTrades: CancelledTrade[]
  let newState: CancelledTradesState

  beforeEach(() => {
    loadedTrades = [{ id: 'a-trade-id' } as CancelledTrade, { id: 'another-trade-id' } as CancelledTrade]
    pageTrades = [{ id: 'another-trade-id' } as CancelledTrade, { id: 'a-new-trade-id' } as CancelledTrade]
  })

  describe('and the page belongs to the stored wallet', () => {
    beforeEach(() => {
      state = {
        ...state,
        address: address.toLowerCase(),
        data: loadedTrades,
        total: 3,
        loading: [fetchMoreCancelledTradesRequest(address, 2)]
      }
      newState = cancelledTradesReducer(state, fetchMoreCancelledTradesSuccess(address, pageTrades, 4))
    })

    it('should append the trades that were not loaded yet', () => {
      expect(newState.data.map(trade => trade.id)).toEqual(['a-trade-id', 'another-trade-id', 'a-new-trade-id'])
    })

    it('should store the new total and clear the loading state', () => {
      expect(newState).toEqual(expect.objectContaining({ total: 4, loading: [] }))
    })
  })

  describe('and the page belongs to another wallet', () => {
    beforeEach(() => {
      state = {
        ...state,
        address: '0xdef',
        data: loadedTrades,
        total: 3,
        loading: [fetchMoreCancelledTradesRequest(address, 2)]
      }
      newState = cancelledTradesReducer(state, fetchMoreCancelledTradesSuccess(address, pageTrades, 4))
    })

    it('should only clear the loading state', () => {
      expect(newState).toEqual({ ...state, loading: [] })
    })
  })
})

describe('when the fetch more cancelled trades failure action is received', () => {
  let newState: CancelledTradesState

  beforeEach(() => {
    state = { ...state, loading: [fetchMoreCancelledTradesRequest(address, 100)] }
    newState = cancelledTradesReducer(state, fetchMoreCancelledTradesFailure(address, 'an error'))
  })

  it('should store the error and clear the loading state', () => {
    expect(newState).toEqual(expect.objectContaining({ error: 'an error', loading: [] }))
  })
})

describe('when an order is re-created', () => {
  let listing: CancelledTrade
  let nftBid: CancelledTrade
  let itemBid: CancelledTrade
  let newState: CancelledTradesState

  beforeEach(() => {
    listing = {
      id: 'a-listing-id',
      type: CancelledTradeType.PUBLIC_NFT_ORDER,
      asset: { contractAddress: '0xcontract', tokenId: '12', itemId: null }
    } as CancelledTrade
    nftBid = {
      id: 'an-nft-bid-id',
      type: CancelledTradeType.BID,
      asset: { contractAddress: '0xcontract', tokenId: '12', itemId: null }
    } as CancelledTrade
    itemBid = {
      id: 'an-item-bid-id',
      type: CancelledTradeType.BID,
      asset: { contractAddress: '0xcontract', tokenId: null, itemId: '3' }
    } as CancelledTrade
    state = { ...state, address: address.toLowerCase(), data: [listing, nftBid, itemBid], total: 10 }
  })

  describe('and it is a listing of a cancelled NFT listing', () => {
    beforeEach(() => {
      newState = cancelledTradesReducer(
        state,
        createOrderSuccess({ contractAddress: '0xCONTRACT', tokenId: '12', chainId: ChainId.MATIC_MAINNET } as NFT, 10, 0)
      )
    })

    it('should drop the cancelled listing and decrement the total', () => {
      expect(newState).toEqual(expect.objectContaining({ data: [nftBid, itemBid], total: 9 }))
    })
  })

  describe('and it is an on-chain listing of a cancelled NFT listing', () => {
    beforeEach(() => {
      newState = cancelledTradesReducer(
        state,
        createOrderSuccess({ contractAddress: '0xcontract', tokenId: '12', chainId: ChainId.MATIC_MAINNET } as NFT, 10, 0, '0xtxhash')
      )
    })

    it('should leave the state untouched', () => {
      expect(newState).toBe(state)
    })
  })

  describe('and it is a bid on an item with a cancelled bid', () => {
    beforeEach(() => {
      newState = cancelledTradesReducer(
        state,
        placeBidSuccess({ contractAddress: '0xcontract', itemId: '3' } as Item, 10, 0, ChainId.MATIC_MAINNET, address)
      )
    })

    it('should drop the cancelled bid and decrement the total', () => {
      expect(newState).toEqual(expect.objectContaining({ data: [listing, nftBid], total: 9 }))
    })
  })

  describe('and it does not match any cancelled order', () => {
    beforeEach(() => {
      newState = cancelledTradesReducer(
        state,
        createOrderSuccess({ contractAddress: '0xcontract', tokenId: '99', chainId: ChainId.MATIC_MAINNET } as NFT, 10, 0)
      )
    })

    it('should leave the state untouched', () => {
      expect(newState).toBe(state)
    })
  })
})
