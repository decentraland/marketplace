import { RentalListing } from '@dcl/schemas'
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
