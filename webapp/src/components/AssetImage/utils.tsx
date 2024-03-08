import { Item } from '@dcl/schemas'

export const getEthereumItemUrn = (item: Item) => {
  const regex = /urn:decentraland:ethereum:collections-v1:[^/]+/
  const match = item.thumbnail.match(regex)
  return match ? match[0] : ''
}
