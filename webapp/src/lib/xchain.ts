import {
  ChainData as SquidChainData,
  Token as SquidToken,
  RouteResponse as SquidRouteResponse
} from '@0xsquid/sdk/dist/types'
import { ChainId } from '@dcl/schemas'
import { Provider } from 'decentraland-dapps/dist/modules/wallet/types'
import { AxelarProvider } from './axelar'

export type Route = RouteResponse

export type BuyNFTXChainData = {
  fromAddress: string
  fromAmount: string
  toAmount: string
  fromToken: string
  fromChain: ChainId
  toChain: ChainId
  enableExpress?: boolean
  slippage?: number
  nft: {
    collectionAddress: string
    tokenId: string
    price: string
  }
}

export type MintNFTXChainData = Omit<BuyNFTXChainData, 'nft'> & {
  item: {
    collectionAddress: string
    itemId: string
    price: string
  }
}

export const SUPPORTED_CHAINS = [
  ChainId.ETHEREUM_MAINNET,
  ChainId.MATIC_MAINNET
]

export type ChainData = SquidChainData
export type Token = SquidToken
export type RouteResponse = SquidRouteResponse

export interface XChainProvider {
  buyNFT(
    provider: Provider,
    buyNFTXChainData: BuyNFTXChainData
  ): Promise<string>
  mintNFT(provider: Provider, ChainCallData: MintNFTXChainData): Promise<string>
}

export const crossChainProvider = new AxelarProvider()
