import { Item } from '@dcl/schemas'

export function getItem(
  contractAddress: string | null,
  tokenId: string | null,
  items: Record<string, Item>
): Item | null {
  if (!contractAddress || !tokenId) {
    return null
  }

  return (
    Object.values(items).find(
      item =>
        item.itemId === tokenId && item.contractAddress === contractAddress
    ) || null
  )
}

export function parseItemId(itemId: string) {
  const [contractAddress, tokenId] = itemId.split('-')
  return { contractAddress, tokenId }
}
