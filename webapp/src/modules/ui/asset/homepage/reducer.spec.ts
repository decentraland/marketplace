import { Item } from '@dcl/schemas'
import { fetchTrendingItemsSuccess } from '../../../item/actions'
import { INITIAL_STATE, homepageReducer, HomepageUIState } from './reducer'

const item = {
  id: 'anId',
  itemId: 'anItemId',
  contractAddress: 'aContractAddress',
  price: '5000000000000000000'
} as Item

const anotherItem = {
  id: 'anotherId',
  itemId: 'anotherItemId',
  price: '1500000000000000000000'
} as Item

describe('when reducing the successful action of fetching trending items', () => {
  const successAction = fetchTrendingItemsSuccess([anotherItem])

  const initialState: HomepageUIState = {
    ...INITIAL_STATE,
    home_trending_items: [item.id]
  }

  it('should return a state with the the loaded items plus the fetched trending items and the loading state cleared', () => {
    expect(homepageReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      home_trending_items: [anotherItem.id]
    })
  })
})
