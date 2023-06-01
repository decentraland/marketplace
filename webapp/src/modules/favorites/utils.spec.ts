import { SortDirection } from '../routing/types'
import { ListsSortBy } from '../vendor/decentraland/favorites/types'
import { ListsBrowseSortBy } from './types'
import { convertListsBrowseSortByIntoApiSortBy } from './utils'

describe.each([
  [ListsBrowseSortBy.NAME_ASC, ListsSortBy.NAME, SortDirection.ASC],
  [ListsBrowseSortBy.NAME_DESC, ListsSortBy.NAME, SortDirection.DESC],
  [ListsBrowseSortBy.NEWEST, ListsSortBy.CREATED_AT, SortDirection.DESC],
  [ListsBrowseSortBy.OLDEST, ListsSortBy.CREATED_AT, SortDirection.ASC],
  [
    ListsBrowseSortBy.RECENTLY_UPDATED,
    ListsSortBy.UPDATED_AT,
    SortDirection.DESC
  ]
])(
  'when converting the %s sortBy into an API sortBy',
  (sortBy, expectedAPISortby, expectedAPISortDirection) => {
    it(`should return the API sortBy ${expectedAPISortby} and the API sortDirection ${expectedAPISortDirection}`, () => {
      expect(convertListsBrowseSortByIntoApiSortBy(sortBy)).toEqual({
        sortBy: expectedAPISortby,
        sortDirection: expectedAPISortDirection
      })
    })
  }
)

describe('when converting a wrong sortBy value into an API sortBy', () => {
  it('should throw an error signaling that the sortBy value is wrong', () => {
    expect(() =>
      convertListsBrowseSortByIntoApiSortBy('wrong' as ListsBrowseSortBy)
    ).toThrowError('Wrong sortBy value')
  })
})
