import { NFTCategory } from '@dcl/schemas'
import { NFT } from '../modules/nft/types'

// EstateRegistry getFingerprint vulnerability (LR-XOR) — contract upgrade.
// Estates with strictly more LANDs than this threshold cannot honor the legacy
// v1 fingerprint after the upgrade. Their pre-upgrade listings (orders, bids,
// trades) become non-executable on-chain and must be re-created by the seller.
export const ESTATE_LR_XOR_SAFE_MAX_SIZE = 18

// Unix seconds of when the marketplace started signing/validating Estate listings
// against getFingerprintV2 (server commit `9877d90`, 2026-05-20 13:37:12 UTC).
// Listings created before this carry a legacy v1 fingerprint; listings created
// after are v2 and remain executable. Used to tell a broken pre-upgrade listing
// apart from a valid new one on a large Estate.
export const ESTATE_V2_FINGERPRINT_LISTING_CUTOFF = 1779284232

function isEstateNFT(nft: NFT | null | undefined): boolean {
  return !!nft && nft.category === NFTCategory.ESTATE
}

function getEstateSize(nft: NFT | null | undefined): number | undefined {
  if (!isEstateNFT(nft)) return undefined
  return nft?.data.estate?.size
}

// Normalizes a timestamp that may arrive in seconds or milliseconds to seconds.
function toSeconds(timestamp: number): number {
  return timestamp > 1e12 ? Math.floor(timestamp / 1000) : timestamp
}

// True when a specific Estate listing (order / bid) is non-executable on-chain
// after the upgrade: the Estate is larger than the LR-XOR safe size AND the
// listing was created before the v2-fingerprint cutoff (so it carries a stale v1
// fingerprint the contract no longer honors).
//
// `listingCreatedAt` is the order/bid creation timestamp (seconds or ms). When it
// is undefined there is no listing to be broken, so this returns false — that is
// what keeps the upgrade warning off Estates that simply have no active listing
// and off valid listings created after the cutoff.
export function isEstateListingAffectedByUpgrade(nft: NFT | null | undefined, listingCreatedAt?: number): boolean {
  const size = getEstateSize(nft)
  if (size === undefined || size <= ESTATE_LR_XOR_SAFE_MAX_SIZE) return false
  if (listingCreatedAt === undefined) return false
  return toSeconds(listingCreatedAt) < ESTATE_V2_FINGERPRINT_LISTING_CUTOFF
}
