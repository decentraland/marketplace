import signedFetch, { AuthIdentity } from 'decentraland-crypto-fetch'
import { ItemFilters } from '../item/types'
import { favoritesAPI, MARKETPLACE_FAVORITES_SERVER_URL } from './api'

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
        ok: true
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

describe('when getting the the items picked in a list', () => {
  let listId: string
  let filters: ItemFilters

  beforeEach(() => {
    listId = 'a-list-id'
    filters = {}
  })

  describe('and the response is not ok', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({ ok: false } as Response)
    })

    it('should throw an error saying that the response is not 2XX', () => {
      return expect(
        favoritesAPI.getPicksByList(listId, filters, identity)
      ).rejects.toThrowError(
        'The marketplace favorites server responded with a non-2XX status code.'
      )
    })
  })

  describe('when the request does not receive query params', () => {
    beforeEach(() => {
      signedFetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ ok: true }) as Response['json']
      } as Response)
    })

    it('should resolve', () => {
      const expectedUrl = `${MARKETPLACE_FAVORITES_SERVER_URL}/lists/${listId}/picks?`
      expect(
        favoritesAPI.getPicksByList(listId, filters, identity)
      ).resolves.toBeUndefined()
      expect(signedFetchMock).toHaveBeenCalledWith(expectedUrl, { identity })
    })
  })

  describe('when the request does not receive query params', () => {
    beforeEach(() => {
      filters = { ...filters, first: 25, skip: 10 }
      signedFetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ ok: true }) as Response['json']
      } as Response)
    })

    it('should resolve', () => {
      const expectedUrl = `${MARKETPLACE_FAVORITES_SERVER_URL}/lists/${listId}/picks?first=${filters.first}&skip=${filters.skip}`
      expect(
        favoritesAPI.getPicksByList(listId, filters, identity)
      ).resolves.toBeUndefined()
      expect(signedFetchMock).toHaveBeenCalledWith(expectedUrl, { identity })
    })
  })
})
