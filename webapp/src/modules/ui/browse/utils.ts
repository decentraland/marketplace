import { Item } from '@dcl/schemas'

export function orderById(ids: string[], items: Item[]) {
  const itemsById = Object.fromEntries(items.map(item => [item.id, item]))
  return ids.map(id => itemsById[id])
}
