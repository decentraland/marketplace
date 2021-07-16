import { BodyShape } from '@dcl/schemas'
import { NFT } from '../types'

export function isGender(wearable: NFT['data']['wearable'], gender: BodyShape) {
  if (!wearable) return false
  if (wearable.bodyShapes.length !== 1) return false
  return wearable.bodyShapes[0] === gender
}

export function isUnisex(wearable: NFT['data']['wearable']) {
  if (!wearable) return false
  return wearable.bodyShapes.length === 2
}
