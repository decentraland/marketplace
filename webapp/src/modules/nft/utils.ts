import { BodyShape, Item, NFTCategory } from '@dcl/schemas'
import { NFT } from './types'

export function getNFTId(contractAddress: string, tokenId: string) {
  return contractAddress + '-' + tokenId
}

// TODO: These methods are repeated on item/utils and can be moved to asset/utils:
//   - getNFT
//   - getNFTId
export function getNFT(
  contractAddress: string | null,
  tokenId: string | null,
  nfts: Record<string, NFT>
): NFT | null {
  if (!contractAddress || !tokenId) {
    return null
  }

  const nftId = getNFTId(contractAddress, tokenId)
  return nftId in nfts ? nfts[nftId] : null
}

export const getBodyShapeUrn = (bodyShape: string) =>
  `urn:decentraland:off-chain:base-avatars:${bodyShape}`

export function isGender(bodyShapes: BodyShape[], gender: BodyShape) {
  if (bodyShapes.length !== 1) {
    return false
  }
  return bodyShapes[0] === gender || getBodyShapeUrn(bodyShapes[0]) === gender
}

export function isUnisex(bodyShapes: BodyShape[]) {
  return bodyShapes.length === 2
}

export function isLand(nft: NFT | Item) {
  return (
    nft.category === NFTCategory.PARCEL || nft.category === NFTCategory.ESTATE
  )
}

export function isParcel(nft: NFT | Item) {
  return nft.category === NFTCategory.PARCEL
}

export function isPartOfEstate(nft: NFT): boolean {
  return Boolean(
    nft.category === NFTCategory.PARCEL && nft.data?.parcel?.estate
  )
}
