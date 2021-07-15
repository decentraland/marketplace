import { BodyShape } from '@dcl/schemas'
import { Wearable } from './types'

export function isGender(wearable: Wearable, gender: BodyShape) {
  if (!wearable) return false
  if (wearable.bodyShapes.length !== 1) return false
  return wearable.bodyShapes[0] === gender
}

export function isUnisex(wearable: Wearable) {
  if (!wearable) return false
  return wearable.bodyShapes.length === 2
}
