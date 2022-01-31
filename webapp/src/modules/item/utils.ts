import { Item } from '@dcl/schemas'

export function getItem(
  contractAddress: string | null,
  tokenId: string | null,
  items: Record<string, Item>
): Item | null {
  if (!contractAddress || !tokenId) {
    return null
  }

  const itemId = getItemId(contractAddress, tokenId)
  return itemId in items ? items[itemId] : null
}

export function getItemId(contractAddress: string, tokenId: string) {
  return contractAddress + '-' + tokenId
}

export function toItemObject(items: Item[]) {
  return items.reduce((obj, item) => {
    obj[item.id] = item
    return obj
  }, {} as Record<string, Item>)
}

// Metadata looks like this:
// - Common: version:item_type:representation_id
// - Wearables: version:item_type:representation_id:category:bodyshapes
export function getMetadata(item: Item) {
  const data = item.data
  if (!data.wearable) {
    throw new Error('Item must be a wearable')
  }
  const bodyShapeTypes = data.wearable.bodyShapes.join(',')

  return buildItemMetadata(
    1,
    getItemMetadataType(item.data),
    item.name,
    data.wearable.description,
    data.wearable.category,
    bodyShapeTypes
  )
}

export enum ItemMetadataType {
  WEARABLE = 'w',
  SMART_WEARABLE = 'sw'
}

export function getItemMetadataType(data: Item['data']) {
  if (data.wearable?.isSmart) {
    return ItemMetadataType.SMART_WEARABLE
  }
  return ItemMetadataType.WEARABLE
}

export function buildItemMetadata(
  version: number,
  type: ItemMetadataType,
  name: string,
  description: string,
  category: string,
  bodyShapeTypes: string
): string {
  return `${version}:${type}:${name}:${description}:${category}:${bodyShapeTypes}`
}
