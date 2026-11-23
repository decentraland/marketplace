import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'

export const LISTING_UNAVAILABLE_ERROR = 'The seller no longer allows this listing to transfer the NFT'

const ERC721_APPROVAL_ABI = [
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function getApproved(uint256 tokenId) view returns (address)'
]

/**
 * Whether the contract a listing settles through can still move the seller's NFT. A seller who revokes
 * that approval leaves the listing live, and buying it only fails once the transaction is sent.
 * A failed read counts as allowed, so an unreachable node never blocks a sale that would go through.
 */
export async function canListingContractTransfer(
  chainId: ChainId,
  contractAddress: string,
  tokenId: string,
  seller: string,
  listingContract: string
): Promise<boolean> {
  try {
    const provider = await getNetworkProvider(chainId)
    const nft = new ethers.Contract(contractAddress, ERC721_APPROVAL_ABI, new ethers.providers.Web3Provider(provider))
    if ((await nft.isApprovedForAll(seller, listingContract)) as boolean) {
      return true
    }
    const approved = (await nft.getApproved(tokenId)) as string
    return approved.toLowerCase() === listingContract.toLowerCase()
  } catch (_error) {
    return true
  }
}
