import { Asset } from '../modules/asset/types'
import { isNFT } from '../modules/asset/utils'
import stolenNftKeys from './stolenNfts.json'

// NFTs reported as stolen in the Payment Processor V2 exploit (Sept 2026), keyed by chainId:contract:tokenId.
const STOLEN_NFTS = new Set<string>(stolenNftKeys)

export const STOLEN_NFT_BUY_ERROR = 'This item was reported as stolen and cannot be bought'
export const STOLEN_NFT_BID_ERROR = 'This item was reported as stolen and cannot receive bids'
export const STOLEN_NFT_SELL_ERROR = 'This item was reported as stolen and cannot be sold'

export function isStolenToken(chainId: number | string, contractAddress: string, tokenId: string): boolean {
  return STOLEN_NFTS.has(`${chainId}:${contractAddress.toLowerCase()}:${tokenId}`)
}

export function isStolenNFT(asset: Asset | null | undefined): boolean {
  if (!asset || !isNFT(asset) || !asset.contractAddress || !asset.tokenId) return false
  return isStolenToken(asset.chainId, asset.contractAddress, asset.tokenId)
}
