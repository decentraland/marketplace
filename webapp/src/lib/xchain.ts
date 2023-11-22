import { ethers } from 'ethers'
import {
  ChainData as SquidChainData,
  Token as SquidToken,
  RouteResponse as SquidRouteResponse
} from '@0xsquid/sdk/dist/types'
import { ChainId } from '@dcl/schemas'
import { Provider } from 'decentraland-dapps/dist/modules/wallet/types'
import { AxelarProvider } from './axelar'

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

export type FromAmountParams = {
  fromToken: Token
  toAmount: string
  toToken: Token
}

export const CROSS_CHAIN_SUPPORTED_CHAINS = [
  ChainId.MATIC_MUMBAI,
  ChainId.ETHEREUM_SEPOLIA,
  ChainId.ETHEREUM_MAINNET,
  ChainId.MATIC_MAINNET
]

export type ChainData = SquidChainData
export type Token = SquidToken
export type RouteResponse = SquidRouteResponse
export type Route = RouteResponse

export interface XChainProvider {
  init(): void
  isLibInitialized(): boolean
  getFromAmount(fromAmountParams: FromAmountParams): Promise<string>
  getSupportedTokens(): Token[]
  getSupportedChains(): ChainData[]
  buyNFT(
    provider: Provider,
    buyNFTXChainData: BuyNFTXChainData
  ): Promise<string>
  mintNFT(provider: Provider, ChainCallData: MintNFTXChainData): Promise<string>
  getBuyNFTRoute(buyNFTXChainData: BuyNFTXChainData): Promise<RouteResponse>
  getMintNFTRoute(buyNFTXChainData: MintNFTXChainData): Promise<RouteResponse>
  executeRoute(
    route: RouteResponse,
    provider: Provider
  ): Promise<ethers.providers.TransactionReceipt>
}

export const crossChainProvider = new AxelarProvider()
