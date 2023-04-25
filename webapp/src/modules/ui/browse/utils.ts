import { Item } from '@dcl/schemas'
import { FavoritesData } from '../../favorites/types'

export function orderById(ids: string[], items: Item[]) {
  const itemsById = Object.fromEntries(items.map(item => [item.id, item]))
  return ids.map(id => itemsById[id])
}

export const byFavoriteCreatedAtAsc = (
  favoritedItems: Record<string, FavoritesData>
) => (a: Item, b: Item) => {
  const favoriteACreatedAt = favoritedItems[a.id]?.createdAt ?? 0
  const favoriteBCreatedAt = favoritedItems[b.id]?.createdAt ?? 0
  if (favoriteACreatedAt < favoriteBCreatedAt) {
    return 1
  } else if (favoriteACreatedAt > favoriteBCreatedAt) {
    return -1
  }
  return 0
}
