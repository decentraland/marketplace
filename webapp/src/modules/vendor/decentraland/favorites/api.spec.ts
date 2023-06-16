import { AuthIdentity } from 'decentraland-crypto-fetch'
import { FavoritedItems, List } from '../../../favorites/types'
import { ItemFilters } from '../item/types'
import { FavoritesAPI, MARKETPLACE_FAVORITES_SERVER_URL } from './api'
import {
  ListDetails,
  ListOfLists,
  Permission,
  UpdateOrCreateList
} from './types'

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
      data = { results: [{ itemId: listId, createdAt: Date.now() }], total: 1 }
      fetchMock.mockResolvedValueOnce(data)
    })

    it('should resolve the favorited item ids and the total favorited', async () => {
      const expectedUrl = `/v1/lists/${listId}/picks`
      await expect(favoritesAPI.getPicksByList(listId, filters)).resolves.toBe(
        data
      )
      expect(fetchMock).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('when the request is made with the first and skip query params', () => {
    let data: { results: FavoritedItems; total: number }

    beforeEach(() => {
      data = { results: [{ itemId: listId, createdAt: Date.now() }], total: 1 }
      filters = { ...filters, first: 25, skip: 10 }
      fetchMock.mockResolvedValueOnce(data)
    })

    it('should resolve the favorited item ids and the total favorited', async () => {
      const expectedUrl = `/v1/lists/${listId}/picks?limit=${filters.first}&offset=${filters.skip}`
      await expect(favoritesAPI.getPicksByList(listId, filters)).resolves.toBe(
        data
      )
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

describe('when picking an item as favorite', () => {
  const errorMessage = 'anErrorMessage'

  let itemId: string

  beforeEach(() => {
    itemId = '0xaddress-anItemId'
  })

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValueOnce(undefined)
    })

    it('should return void', () => {
      return expect(
        favoritesAPI.pickItemAsFavorite(itemId)
      ).resolves.toBeUndefined()
    })
  })

  describe('when the request fails with a 422 status code error', () => {
    beforeEach(() => {
      fetchMock.mockRejectedValue({ message: errorMessage, status: 422 })
    })

    it('should catch the error and ignore it', () => {
      return expect(
        favoritesAPI.pickItemAsFavorite(itemId)
      ).resolves.toBeUndefined()
    })
  })

  describe('when the request fails with an error code that is not a 422', () => {
    const error = { message: errorMessage, status: 500 }
    beforeEach(() => {
      fetchMock.mockRejectedValue(error)
    })

    it('should throw the error', () => {
      return expect(favoritesAPI.pickItemAsFavorite(itemId)).rejects.toEqual(
        error
      )
    })
  })
})

describe('when getting the lists', () => {
  describe('when the request fails', () => {
    let error: { message: string; status: number }
    beforeEach(() => {
      error = {
        message: 'An error ocurred',
        status: 500
      }
      fetchMock.mockRejectedValue(error)
    })

    it('should reject with the request error', () => {
      return expect(favoritesAPI.getLists()).rejects.toEqual(error)
    })
  })

  describe('when the request succeeds', () => {
    let response: { results: ListOfLists[]; total: number }
    beforeEach(() => {
      response = {
        results: [
          {
            id: 'aListId',
            name: 'aName',
            itemsCount: 1,
            previewOfItemIds: ['anItemId']
          }
        ],
        total: 1
      }
      fetchMock.mockResolvedValueOnce(response)
    })

    it('should resolve with the lists and the total number of lists', () => {
      return expect(favoritesAPI.getLists()).resolves.toEqual(response)
    })
  })

  describe.each([
    ['first', 10, 'limit'],
    ['skip', 20, 'offset'],
    ['sortBy', 'name', 'sortBy'],
    ['sortDirection', 'asc', 'sortDirection'],
    ['itemId', 'anItemId', 'itemId']
  ])(
    'when the request is made with the %s parameter',
    (parameter, value, expectedParameter) => {
      let response: { results: ListOfLists[]; total: number }
      beforeEach(async () => {
        response = {
          results: [
            {
              id: 'aListId',
              name: 'aName',
              itemsCount: 1,
              previewOfItemIds: ['anItemId']
            }
          ],
          total: 1
        }
        fetchMock.mockResolvedValueOnce(response)
        await favoritesAPI.getLists({
          [parameter]: value
        })
      })

      it(`should have called the API with the query parameter ${parameter} with its value`, () => {
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining(`${expectedParameter}=${value}`)
        )
      })
    }
  )
})

describe('when deleting a list', () => {
  describe('and the request fails', () => {
    let error: { message: string; status: number }
    beforeEach(() => {
      error = {
        message: 'An error ocurred',
        status: 500
      }
      fetchMock.mockRejectedValue(error)
    })

    it('should reject with the request error', () => {
      return expect(favoritesAPI.deleteList('aListId')).rejects.toEqual(error)
    })
  })

  describe('when the request succeeds', () => {
    let response: { ok: true }
    beforeEach(() => {
      response = { ok: true }
      fetchMock.mockResolvedValueOnce(response)
    })

    it('should resolve', () => {
      return expect(favoritesAPI.deleteList('aListId')).resolves.toEqual(
        response
      )
    })
  })
})

describe('when getting a list', () => {
  describe('and the request fails', () => {
    let error: { message: string; status: number }
    beforeEach(() => {
      error = {
        message: 'An error ocurred',
        status: 500
      }
      fetchMock.mockRejectedValue(error)
    })

    it('should reject with the request error', () => {
      return expect(favoritesAPI.getList('aListId')).rejects.toEqual(error)
    })
  })

  describe('when the request succeeds', () => {
    let response: { ok: true; data: ListDetails }
    let list: ListDetails

    beforeEach(() => {
      list = {
        id: 'aListId',
        name: 'aName',
        description: 'aDescription',
        userAddress: 'anOwnerAddress',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        itemsCount: 1,
        isPrivate: true,
        permission: Permission.VIEW
      }
      response = { ok: true, data: list }
      fetchMock.mockResolvedValueOnce(response)
    })

    it('should resolve with the retrieved list', () => {
      return expect(favoritesAPI.getList(list.id)).resolves.toEqual(response)
    })
  })
})

describe('when updating a list', () => {
  describe('and the request fails', () => {
    let error: { message: string; status: number }

    beforeEach(() => {
      error = {
        message: 'An error ocurred',
        status: 500
      }
      fetchMock.mockRejectedValue(error)
    })

    it('should reject with the request error', () => {
      return expect(favoritesAPI.updateList('aListId', {})).rejects.toEqual(
        error
      )
    })
  })

  describe('when the request succeeds', () => {
    let response: { ok: true; data: Partial<List> }
    let list: UpdateOrCreateList

    beforeEach(() => {
      list = {
        id: 'aListId',
        name: 'aName',
        description: 'aDescription',
        userAddress: 'anOwnerAddress',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPrivate: true,
        permission: Permission.VIEW
      }
      response = { ok: true, data: list }
      fetchMock.mockResolvedValueOnce(response)
    })

    it('should resolve with the retrieved list', () => {
      return expect(
        favoritesAPI.updateList(list.id, {
          name: list.name,
          description: list.description ?? '',
          isPrivate: list.isPrivate
        })
      ).resolves.toEqual(response)
    })
  })
})

describe('when creating a list', () => {
  describe('and the request fails', () => {
    let error: { message: string; status: number }

    beforeEach(() => {
      error = {
        message: 'An error ocurred',
        status: 500
      }
      fetchMock.mockRejectedValue(error)
    })

    it('should reject with the request error', () => {
      return expect(
        favoritesAPI.createList({
          name: 'aListName',
          isPrivate: true,
          description: 'aListDescription'
        })
      ).rejects.toEqual(error)
    })
  })

  describe('when the request succeeds', () => {
    let response: { ok: true; data: UpdateOrCreateList }
    let list: UpdateOrCreateList

    beforeEach(() => {
      list = {
        id: 'aListId',
        name: 'aName',
        description: 'aDescription',
        userAddress: 'anOwnerAddress',
        createdAt: Date.now(),
        updatedAt: null,
        isPrivate: true,
        permission: Permission.VIEW
      }
      response = { ok: true, data: list }
      fetchMock.mockResolvedValueOnce(response)
    })

    it('should resolve with the retrieved list', () => {
      return expect(
        favoritesAPI.createList({
          name: list.name,
          isPrivate: true
        })
      ).resolves.toEqual(response)
    })
  })
})
