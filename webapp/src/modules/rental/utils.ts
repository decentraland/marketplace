import { Asset } from '../asset/types'

export function getOpenRentalId(asset: Asset | null): string | null {
  return asset && 'activeOrderId' in asset && !!asset.openRentalId
    ? asset.openRentalId
    : null
}
