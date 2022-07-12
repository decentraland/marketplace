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

export function parseItemId(itemId: string) {
  const [contractAddress, tokenId] = itemId.split('-')
  return { contractAddress, tokenId }
}
