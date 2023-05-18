import { Asset } from '../../../modules/asset/types'

export const getUrn = (item: Asset) => {
  const regex = /urn:decentraland:matic:collections-v2:[^/]+/
  if ('thumbnail' in item) {
    const match = item.thumbnail.match(regex)
    return match ? match[0] : ''
  }
  return ''
}
