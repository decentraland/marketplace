import { NFTCategory } from '@dcl/schemas'
import { NFT } from '../modules/nft/types'

export function getCategoryInfo(nft: NFT) {
  switch (nft.category) {
    case NFTCategory.EMOTE:
      return { emoteCategory: nft.data.emote?.category }
    case NFTCategory.WEARABLE:
      return { wearableCategory: nft.data.wearable?.category }
    default:
      return {}
  }
}
