import signedFetch, { AuthIdentity } from 'decentraland-crypto-fetch'
import { favoritesAPI } from './api'

jest.mock('decentraland-crypto-fetch')

const signedFetchMock: jest.MockedFunction<typeof signedFetch> = (signedFetch as unknown) as jest.MockedFunction<
  typeof signedFetch
>
let itemId: string
let identity: AuthIdentity

beforeEach(() => {
  itemId = 'an-item-id'
  identity = {} as AuthIdentity
})

describe('when picking an item as favorite', () => {
  describe('and the response is not ok', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({ ok: false } as Response)
    })

    it('should throw an error saying that the response is not 2XX', () => {
      return expect(
        favoritesAPI.pickItemAsFavorite(itemId, identity)
      ).rejects.toThrowError(
        'The marketplace favorites server responded with a non-2XX status code.'
      )
    })
  })

  describe('and the response is successful', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ ok: true }) as Response['json']
      } as Response)
    })

    it('should resolve', () => {
      return expect(
        favoritesAPI.pickItemAsFavorite(itemId, identity)
      ).resolves.toBeUndefined()
    })
  })
})

describe('when unpicking an item as favorite', () => {
  describe('and the response is not ok', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({ ok: false } as Response)
    })

    it('should throw an error saying that the response is not 2XX', () => {
      return expect(
        favoritesAPI.unpickItemAsFavorite(itemId, identity)
      ).rejects.toThrowError(
        'The marketplace favorites server responded with a non-2XX status code.'
      )
    })
  })

  describe('and the response is successful', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ ok: true }) as Response['json']
      } as Response)
    })

    it('should resolve', () => {
      return expect(
        favoritesAPI.unpickItemAsFavorite(itemId, identity)
      ).resolves.toBeUndefined()
    })
  })
})

describe('when getting who favorited an item', () => {
  let fetchMock: jest.SpyInstance
  let body: { ok: boolean; message?: string; data?: any }
  beforeEach(() => {
    fetchMock = jest.spyOn(global, 'fetch')
  })

  describe('and the response status code is not ok', () => {
    beforeEach(() => {
      body = { ok: false }
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(body) as Response['json']
      })
    })

    describe('and the parsed response includes a message', () => {
      beforeEach(() => {
        body.message = 'An error'
      })

      it('should reject with the response error message', () => {
        return expect(
          favoritesAPI.getWhoFavoritedAnItem(itemId, 0, 10)
        ).rejects.toThrowError(body.message)
      })
    })

    describe("and the parsed response doesn't include a message", () => {
      it('should reject with an "Unknown error"', () => {
        return expect(
          favoritesAPI.getWhoFavoritedAnItem(itemId, 0, 10)
        ).rejects.toThrowError('Unknown error')
      })
    })
  })

  describe('and the response is successful', () => {
    beforeEach(() => {
      body = {
        ok: true,
        data: {
          results: ['0x0'],
          total: 1
        }
      }
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(body) as Response['json']
      })
    })

    it('should resolve with the addresses of the users who favorited the item and the total of them', () => {
      return expect(
        favoritesAPI.getWhoFavoritedAnItem(itemId, 0, 10)
      ).resolves.toEqual({
        addresses: body.data?.results,
        total: body.data?.total
      })
    })
  })
})
