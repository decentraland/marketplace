import { Item } from '@dcl/schemas'

export const getEthereumItemUrn = (item: Item) => {
  let regex = /urn:decentraland:ethereum:collections-v1:[^/]+/

  if ('thumbnail' in item) {
    const match = item.thumbnail.match(regex)
    return match ? match[0] : ''
  }
  return ''
}
