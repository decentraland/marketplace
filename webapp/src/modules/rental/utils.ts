import { NFT } from '@dcl/schemas'
import { Asset } from '../asset/types'

export function getOpenRentalId(asset: Asset | null): string | null {
  return (asset as NFT).openRentalId ?? null
}
