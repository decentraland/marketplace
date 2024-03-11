import { Item } from '@dcl/schemas'
import { FavoritesData } from '../../favorites/types'
import { byFavoriteCreatedAtAsc } from './utils'

describe('when ordering items by the creation date of their favorites', () => {
  let items: Item[]
  let favoritedItems: Record<string, FavoritesData>

  beforeEach(() => {
    items = [{ id: '1' } as Item, { id: '2' } as Item, { id: '3' } as Item, { id: '4' } as Item]
    favoritedItems = {
      '1': { createdAt: 0, count: 0 },
      '2': { createdAt: 1, count: 0 },
      '3': { createdAt: 2, count: 0 },
      '4': { createdAt: 0, count: 0 }
    }
  })

  it('should order them in an ascending way', () => {
    expect(items.sort(byFavoriteCreatedAtAsc(favoritedItems))).toStrictEqual([
      { id: '3' } as Item,
      { id: '2' } as Item,
      { id: '1' } as Item,
      { id: '4' } as Item
    ])
  })
})
