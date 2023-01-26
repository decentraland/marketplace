import { Order, RentalListing } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import { acceptRentalListingSuccess } from '../rental/actions'
import { NFT, NFTsFetchOptions, NFTsFetchParams } from '../nft/types'
import {
  fetchNFTRequest,
  fetchNFTsFailure,
  fetchNFTsRequest,
  fetchNFTsSuccess,
  fetchNFTSuccess
} from '../nft/actions'
import { VendorName } from '../vendor'
import { View } from '../ui/types'
import {
  cancelOrderFailure,
  cancelOrderRequest,
  cancelOrderSuccess,
  createOrderFailure,
  createOrderRequest,
  createOrderSuccess,
  executeOrderFailure,
  executeOrderRequest,
  executeOrderSuccess,
  executeOrderWithCardFailure,
  executeOrderWithCardRequest,
  executeOrderWithCardSuccess
} from './actions'
import { orderReducer, OrderState, INITIAL_STATE } from './reducer'

const nft = {
  id: 'anId',
  tokenId: 'anItemId',
  contractAddress: 'aContractAddress'
} as NFT
const order = {
  id: 'aId',
  contractAddress: 'aContractAddress',
  tokenId: 'aTokenId',
  price: '100000000000'
} as Order
const anotherOrder = {
  id: 'anotherId',
  contractAddress: 'anotherContractAddress',
  tokenId: 'anotherTokenId',
  price: '100000000000'
} as Order
const txHash = 'aTxHash'
const anErrorMessage = 'An error'
const fingerprint = 'aFingerprint'
const nftsFetchOptions: NFTsFetchOptions = {
  vendor: 'aVendorName' as VendorName,
  filters: {},
  view: View.MARKET,
  params: {} as NFTsFetchParams
}
const timestamp = 1627595757

let state: OrderState
let rentalListing: RentalListing

beforeEach(() => {
  state = {
    data: {},
    loading: [],
    error: null
  }
  rentalListing = {
    contractAddress: 'aContractAddress',
    tokenId: 'aTokenId'
  } as RentalListing
})

const requestActions = [
  createOrderRequest(nft, Number(order.price), order.expiresAt),
  executeOrderRequest(order, nft, fingerprint),
  executeOrderWithCardRequest(nft),
  cancelOrderRequest(order, nft),
  fetchNFTsRequest(nftsFetchOptions)
]

requestActions.forEach(action => {
  describe(`when reducing the "${action.type}" action`, () => {
    it('should return a state with the loading set', () => {
      const initialState = {
        ...INITIAL_STATE,
        loading: []
      }

      expect(orderReducer(initialState, action)).toEqual({
        ...INITIAL_STATE,
        loading: loadingReducer(initialState.loading, action)
      })
    })
  })
})

const successActions = [
  createOrderSuccess(nft, Number(order.price), order.expiresAt, txHash),
  executeOrderSuccess(),
  executeOrderWithCardSuccess(),
  cancelOrderSuccess(order, nft, txHash)
]

successActions.forEach(action => {
  describe(`when reducing the "${action.type}" action`, () => {
    it('should return a state with the loading set', () => {
      const initialState = {
        ...INITIAL_STATE,
        loading: [],
        error: anErrorMessage
      }

      expect(orderReducer(initialState, action)).toEqual({
        ...INITIAL_STATE,
        loading: loadingReducer(initialState.loading, action),
        error: null
      })
    })
  })
})

describe('when reducing the successful action of fetching nfts', () => {
  const requestAction = fetchNFTsRequest(nftsFetchOptions)
  const successAction = fetchNFTsSuccess(
    nftsFetchOptions,
    [nft],
    [],
    [order],
    [],
    1,
    timestamp
  )

  const initialState = {
    ...INITIAL_STATE,
    data: { anotherId: anotherOrder },
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with the the loaded orders and the loading state cleared', () => {
    expect(orderReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: { ...initialState.data, [order.id]: order }
    })
  })
})

const failureActions = [
  {
    request: createOrderRequest(nft, Number(order.price), order.expiresAt),
    failure: createOrderFailure(
      nft,
      Number(order.price),
      order.expiresAt,
      anErrorMessage
    )
  },
  {
    request: executeOrderRequest(order, nft, fingerprint),
    failure: executeOrderFailure(order, nft, anErrorMessage)
  },
  {
    request: executeOrderWithCardRequest(nft),
    failure: executeOrderWithCardFailure(nft, anErrorMessage)
  },
  {
    request: cancelOrderRequest(order, nft),
    failure: cancelOrderFailure(order, nft, anErrorMessage)
  },
  {
    request: fetchNFTsRequest(nftsFetchOptions),
    failure: fetchNFTsFailure(nftsFetchOptions, anErrorMessage, timestamp)
  }
]

failureActions.forEach(action => {
  describe(`when reducing the "${action.failure.type}" action`, () => {
    it('should return a state with the error set and the loading state cleared', () => {
      const initialState = {
        ...INITIAL_STATE,
        error: null,
        loading: loadingReducer([], action.request)
      }

      expect(orderReducer(initialState, action.failure)).toEqual({
        ...INITIAL_STATE,
        error: anErrorMessage,
        loading: []
      })
    })
  })
})

describe('when reducing the successful action of fetching an nft', () => {
  const requestAction = fetchNFTRequest(nft.contractAddress, nft.tokenId)
  const successAction = fetchNFTSuccess(nft, order, null)

  const initialState = {
    ...INITIAL_STATE,
    data: { anotherId: anotherOrder },
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with the the loaded orders plus the fetched order and the loading state cleared', () => {
    expect(orderReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: { ...initialState.data, [order.id]: order }
    })
  })
})

describe('when reducing the successful action of accepting a rental', () => {
  beforeEach(() => {
    state.data = {
      // Same contract address but different token id
      fstOrder: {
        contractAddress: 'aContractAddress',
        tokenId: 'fstTokenId'
      } as Order,
      // Same contract address and same token id
      sndOrder: {
        contractAddress: 'aContractAddress',
        tokenId: 'aTokenId'
      } as Order,
      // Different contract address and same token id
      trdOrder: {
        contractAddress: 'fstContractAddress',
        tokenId: 'aTokenId'
      } as Order,
      // Different contract address and different token id
      ftOrder: {
        contractAddress: 'ftContractAddress',
        tokenId: 'ftTokenId'
      } as Order
    }
  })

  it('should remove the order of the NFT that had the rental listing', () => {
    expect(
      orderReducer(state, acceptRentalListingSuccess(nft, rentalListing, 0))
    ).toEqual({
      ...state,
      data: {
        ftOrder: {
          contractAddress: 'ftContractAddress',
          tokenId: 'ftTokenId'
        } as Order,
        trdOrder: {
          contractAddress: 'fstContractAddress',
          tokenId: 'aTokenId'
        } as Order,
        fstOrder: {
          contractAddress: 'aContractAddress',
          tokenId: 'fstTokenId'
        } as Order
      }
    })
  })
})
