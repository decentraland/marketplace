import { NFT } from '../types'
import { BodyShape } from './types'

export function isGender(nft: NFT, gender: BodyShape) {
  if (!nft.wearable) return false
  if (nft.wearable.bodyShapes.length !== 1) return false
  return nft.wearable.bodyShapes[0] === gender
}

export function isUnisex(nft: NFT) {
  if (!nft.wearable) return false
  return nft.wearable.bodyShapes.length === 2
}
