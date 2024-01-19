import { URL } from 'url'
import {
  RentalListing,
  RentalsListingsFilterByCategory,
  RentalStatus
} from '@dcl/schemas'
import signedFetch from 'decentraland-crypto-fetch'
import { rentalsAPI } from './api'

jest.mock('decentraland-crypto-fetch')

const signedFetchMock: jest.MockedFunction<typeof signedFetch> = (signedFetch as unknown) as jest.MockedFunction<
  typeof signedFetch
>
let rental: RentalListing

beforeEach(() => {
  rental = {
    id: 'a-rental-listing-id'
  } as RentalListing

  signedFetchMock.mockReset()
})

describe('when refreshing the rental listings', () => {
  describe('and the response is not ok', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({ ok: false } as Response)
    })

    it('should throw an error saying that the response is not 2XX', () => {
      return expect(
        rentalsAPI.refreshRentalListing(rental.id)
      ).rejects.toThrowError(
        'The signature server responded without a 2XX status code.'
      )
    })
  })

  describe("and there's an error when parsing the JSON", () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest
          .fn()
          .mockRejectedValueOnce(new Error('A JSON error')) as Response['json']
      } as Response)
    })

    it('should throw an error with the cause', () => {
      return expect(
        rentalsAPI.refreshRentalListing(rental.id)
      ).rejects.toThrowError('A JSON error')
    })
  })

  describe('and the ok property of the JSON body is not true', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          ok: false,
          message: 'A server error'
        }) as Response['json']
      } as Response)
    })

    it('should throw an error with the message', () => {
      return expect(
        rentalsAPI.refreshRentalListing(rental.id)
      ).rejects.toThrowError('A server error')
    })
  })

  describe('and the response is successful', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValueOnce({ ok: true, data: rental }) as Response['json']
      } as Response)
    })

    it('should return the rental', () => {
      return expect(
        rentalsAPI.refreshRentalListing(rental.id)
      ).resolves.toEqual(rental)
    })
  })
})

describe('when getting rental listings', () => {
  describe('and the response is not ok', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({ ok: false } as Response)
    })

    it('should throw an error saying that the response is not 2XX', () => {
      return expect(
        rentalsAPI.refreshRentalListing(rental.id)
      ).rejects.toThrowError(
        'The signature server responded without a 2XX status code.'
      )
    })
  })

  describe("and there's an error when parsing the JSON", () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest
          .fn()
          .mockRejectedValueOnce(new Error('A JSON error')) as Response['json']
      } as Response)
    })

    it('should throw an error with the cause', () => {
      return expect(
        rentalsAPI.refreshRentalListing(rental.id)
      ).rejects.toThrowError('A JSON error')
    })
  })

  describe('and the ok property of the JSON body is not true', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          ok: false,
          message: 'A server error'
        }) as Response['json']
      } as Response)
    })

    it('should throw an error with the message', () => {
      return expect(
        rentalsAPI.refreshRentalListing(rental.id)
      ).rejects.toThrowError('A server error')
    })
  })

  describe('and the response is successful', () => {
    let result: { results: RentalListing[]; total: number }

    beforeEach(async () => {
      signedFetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          ok: true,
          data: { limit: 12, page: 0, pages: 1, total: 1, results: [rental] }
        }) as Response['json']
      } as Response)
      result = await rentalsAPI.getRentalListings({
        limit: 12,
        page: 0,
        status: [RentalStatus.EXECUTED, RentalStatus.CLAIMED]
      })
    })

    it('should return the rental', () => {
      expect(result).toEqual({
        limit: 12,
        page: 0,
        pages: 1,
        total: 1,
        results: [rental]
      })
    })

    it('should have called the signatures server with the correct search parameters', () => {
      expect(typeof signedFetchMock.mock.calls[0][0]).toBe('string')
      const url = new URL(signedFetchMock.mock.calls[0][0] as string)
      expect(url.searchParams.get('limit')).toEqual('12')
      expect(url.searchParams.get('page')).toEqual('0')
      expect(url.searchParams.getAll('status')).toEqual([
        RentalStatus.EXECUTED,
        RentalStatus.CLAIMED
      ])
    })
  })
})

describe('when getting rental listings prices', () => {
  describe('when request finished successfully', () => {
    let prices = { '100': 1 }
    beforeEach(() => {
      jest.spyOn(rentalsAPI, 'request').mockResolvedValueOnce(prices)
    })

    it('should call signature api with correct params', async () => {
      await rentalsAPI.getRentalListingsPrices({
        category: RentalsListingsFilterByCategory.PARCEL
      })
      expect(rentalsAPI.request).toHaveBeenCalledWith(
        'get',
        '/rental-listings/prices?category=parcel'
      )
    })

    it('should return rental listings prices object', async () => {
      const response = await rentalsAPI.getRentalListingsPrices({
        category: RentalsListingsFilterByCategory.PARCEL
      })
      expect(response).toEqual(prices)
    })
  })

  describe('when request finished with errors', () => {
    const errorMessage = 'somwthing went wrong'

    beforeEach(() => {
      jest
        .spyOn(rentalsAPI, 'request')
        .mockRejectedValueOnce(new Error(errorMessage))
    })
    it('should return error message', async () => {
      expect(
        rentalsAPI.getRentalListingsPrices({
          category: RentalsListingsFilterByCategory.PARCEL
        })
      ).rejects.toThrowError(errorMessage)
    })
  })
})
