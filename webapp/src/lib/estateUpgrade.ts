import { NFTCategory } from '@dcl/schemas'
import { NFT } from '../modules/nft/types'

// EstateRegistry getFingerprint vulnerability (LR-XOR) — contract upgrade.
// Estates with strictly more LANDs than this threshold cannot honor the legacy
// v1 fingerprint after the upgrade. Their pre-upgrade listings (orders, bids,
// trades) become non-executable on-chain and must be re-created by the seller.
export const ESTATE_LR_XOR_SAFE_MAX_SIZE = 18

export function isEstateNFT(nft: NFT | null | undefined): boolean {
  return !!nft && nft.category === NFTCategory.ESTATE
}

export function getEstateSize(nft: NFT | null | undefined): number | undefined {
  if (!isEstateNFT(nft)) return undefined
  return nft?.data.estate?.size
}

// True when an Estate listing (order / bid / rental) is non-executable on-chain
// because the underlying Estate exceeds the size that the post-upgrade
// EstateRegistry can still verify with the legacy v1 fingerprint.
export function isEstateListingAffectedByUpgrade(nft: NFT | null | undefined): boolean {
  const size = getEstateSize(nft)
  return size !== undefined && size > ESTATE_LR_XOR_SAFE_MAX_SIZE
}
