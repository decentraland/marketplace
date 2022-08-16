import { RentalListing, RentalStatus } from '@dcl/schemas'
import { fetchNFTsSuccess, fetchNFTSuccess } from '../nft/actions'
import { NFTsFetchOptions, NFT } from '../nft/types'
import { rentalReducer, RentalState } from './reducer'

let rentalState: RentalState

beforeEach(() => {
  rentalState = {
    data: {},
    loading: [],
    error: null
  }
})

describe('when reducing the success action of fetching NFTs', () => {
  let oldRentalId: string
  let rentalListingsFromNFTServer: RentalListing[]

  beforeEach(() => {
    oldRentalId = 'aRentalId'
    rentalState = {
      ...rentalState,
      data: {
        ...rentalState.data,
        [oldRentalId]: {
          id: oldRentalId,
          status: RentalStatus.OPEN
        } as RentalListing
      }
    }
    rentalListingsFromNFTServer = [
      {
        id: 'aNewRentalId'
      } as RentalListing,
      { id: oldRentalId, status: RentalStatus.EXECUTED } as RentalListing
    ]
  })

  it('should add the new rental listings to the stored rentals and overwrite rentals that that the same id', () => {
    expect(
      rentalReducer(
        rentalState,
        fetchNFTsSuccess(
          {} as NFTsFetchOptions,
          [],
          [],
          [],
          rentalListingsFromNFTServer,
          2,
          Date.now()
        )
      )
    ).toEqual({
      ...rentalState,
      data: {
        ...rentalState.data,
        aNewRentalId: rentalListingsFromNFTServer[0],
        [oldRentalId]: rentalListingsFromNFTServer[1]
      }
    })
  })
})

describe('when reducing the success action of fetching a NFT', () => {
  let rentalListing: RentalListing | null

  describe('and the NFT has a rental', () => {
    beforeEach(() => {
      rentalListing = {
        id: 'aNewRentalListing'
      } as RentalListing
    })

    it('should store the rental', () => {
      expect(
        rentalReducer(
          rentalState,
          fetchNFTSuccess({} as NFT, null, rentalListing)
        )
      ).toEqual({
        ...rentalState,
        data: {
          ...rentalState.data,
          [rentalListing!.id]: rentalListing
        }
      })
    })
  })

  describe("and the NFT doesn't have a rental", () => {
    beforeEach(() => {
      rentalListing = null
    })

    it('should return the state unchanged', () => {
      expect(
        rentalReducer(
          rentalState,
          fetchNFTSuccess({} as NFT, null, rentalListing)
        )
      ).toBe(rentalState)
    })
  })
})
