import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ItemFilters } from '../item/types'
import { FavoritesAPI, MARKETPLACE_FAVORITES_SERVER_URL } from './api'
import { FavoritedItems } from '../../../favorites/types'

let itemId: string
let identity: AuthIdentity
let favoritesAPI: FavoritesAPI
let fetchMock: jest.SpyInstance

beforeEach(() => {
  itemId = 'an-item-id'
  identity = {} as AuthIdentity
  favoritesAPI = new FavoritesAPI(MARKETPLACE_FAVORITES_SERVER_URL, {
    identity
  })
  fetchMock = jest.spyOn(favoritesAPI as any, 'fetch')
})

describe('when getting the items picked in a list', () => {
  let listId: string
  let filters: ItemFilters

  beforeEach(() => {
    listId = 'a-list-id'
    filters = {}
  })

  describe('when the request does not receive query params', () => {
    let data: { results: FavoritedItems; total: number }

    beforeEach(() => {
      data = { results: [{ itemId: listId }], total: 1 }
      fetchMock.mockResolvedValueOnce(data)
    })

    it('should resolve the favorited item ids and the total favorited', () => {
      const expectedUrl = `/v1/lists/${listId}/picks`
      expect(favoritesAPI.getPicksByList(listId, filters)).resolves.toBe(data)
      expect(fetchMock).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('when the request is made with the first and skip query params', () => {
    let data: { results: FavoritedItems; total: number }

    beforeEach(() => {
      data = { results: [{ itemId: listId }], total: 1 }
      filters = { ...filters, first: 25, skip: 10 }
      fetchMock.mockResolvedValueOnce(data)
    })

    it('should resolve the favorited item ids and the total favorited', () => {
      const expectedUrl = `/v1/lists/${listId}/picks?limit=${filters.first}&offset=${filters.skip}`
      expect(favoritesAPI.getPicksByList(listId, filters)).resolves.toBe(data)
      expect(fetchMock).toHaveBeenCalledWith(expectedUrl)
    })
  })
})

describe('when getting who favorited an item', () => {
  let data: { results: { userAddress: string }[]; total: number }

  describe('and the response is successful', () => {
    beforeEach(() => {
      data = {
        results: [{ userAddress: '0x0' }],
        total: 1
      }
      fetchMock.mockResolvedValueOnce(data)
    })

    it('should resolve with the addresses of the users who favorited the item and the total of them', () => {
      return expect(
        favoritesAPI.getWhoFavoritedAnItem(itemId, 0, 10)
      ).resolves.toEqual({
        addresses: data.results.map(
          (pick: { userAddress: string }) => pick.userAddress
        ),
        total: data.total
      })
    })
  })
})
