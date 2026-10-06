import { ChainId, Network, TradeAssetType } from '@dcl/schemas'

export enum CancelledTradeType {
  BID = 'bid',
  PUBLIC_NFT_ORDER = 'public_nft_order',
  PUBLIC_ITEM_ORDER = 'public_item_order'
}

export enum CancellationReason {
  CONTRACT_SIGNATURE_INDEX_BUMP = 'contract_signature_index_bump'
}

export type CancelledTrade = {
  id: string
  type: CancelledTradeType
  network: Network.ETHEREUM | Network.MATIC
  chainId: ChainId
  contract: string
  reason: CancellationReason
  createdAt: number
  expiresAt: number
  cancelledAt: number
  asset: {
    contractAddress: string
    tokenId: string | null
    itemId: string | null
    name: string | null
    image: string | null
  }
  price: {
    assetType: TradeAssetType
    amount: string
  } | null
}

export type CancelledTradesFilters = {
  reason?: CancellationReason
  first?: number
  skip?: number
  type?: CancelledTradeType[]
}

export type CancelledTradesResponse = {
  data: CancelledTrade[]
  total: number
}
