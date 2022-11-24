import { Order, RentalListing } from '@dcl/schemas'
import { acceptRentalListingSuccess } from '../rental/actions'
import { orderReducer, OrderState } from './reducer'

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
      orderReducer(state, acceptRentalListingSuccess(rentalListing, 0))
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
