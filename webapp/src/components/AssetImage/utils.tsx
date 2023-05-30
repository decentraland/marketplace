import { Network } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'

export const getUrn = (item: Asset) => {
  let regex
  if (item.network === Network.MATIC) {
    regex = /urn:decentraland:matic:collections-v2:[^/]+/
  } else {
    regex = /urn:decentraland:ethereum:collections-v1:[^/]+/
  }
  if ('image' in item) {
    const match = item.image.match(regex)
    return match ? match[0] : ''
  }
  return ''
}
