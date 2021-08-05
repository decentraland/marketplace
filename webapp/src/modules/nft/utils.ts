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
