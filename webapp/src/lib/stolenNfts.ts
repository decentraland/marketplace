import { Asset } from '../modules/asset/types'
import { isNFT } from '../modules/asset/utils'
import stolenNftsByContract from './stolenNfts.json'

// NFTs reported as stolen in the Payment Processor V2 exploit (Sept 2026), grouped by chainId:contract in the JSON.
export const STOLEN_NFT_KEYS: readonly string[] = Object.entries(stolenNftsByContract).flatMap(([contractKey, tokenIds]) =>
  tokenIds.map(tokenId => `${contractKey}:${tokenId}`)
)

const STOLEN_NFTS = new Set<string>(STOLEN_NFT_KEYS)

export const STOLEN_NFT_BUY_ERROR = 'This item was reported as stolen and cannot be bought'
export const STOLEN_NFT_BID_ERROR = 'This item was reported as stolen and cannot receive bids'
export const STOLEN_NFT_SELL_ERROR = 'This item was reported as stolen and cannot be sold'
export const STOLEN_NFT_RENT_ERROR = 'This item was reported as stolen and cannot be rented'

export function isStolenToken(chainId: number | string, contractAddress: string, tokenId: string): boolean {
  return STOLEN_NFTS.has(`${chainId}:${contractAddress.toLowerCase()}:${tokenId}`)
}

export function isStolenNFT(asset: Asset | null | undefined): boolean {
  if (!asset || !isNFT(asset) || !asset.contractAddress || !asset.tokenId) return false
  return isStolenToken(asset.chainId, asset.contractAddress, asset.tokenId)
}
