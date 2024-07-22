import { Bid, ChainId, GetBidsParameters, PaginatedResponse, Trade } from '@dcl/schemas'
import { BaseClient } from 'decentraland-dapps/dist/lib'
import { config } from '../../../../config'
import { retryParams } from '../utils'
import { Balance } from './types'

export const MARKETPLACE_SERVER_URL = config.get('MARKETPLACE_SERVER_URL')

export class MarketplaceAPI extends BaseClient {
  fetchWalletTokenBalances = async (chain: ChainId, wallet: string): Promise<Balance[]> => {
    const chainIdToChainName = {
      [ChainId.ETHEREUM_MAINNET]: 'eth-mainnet',
      [ChainId.ETHEREUM_SEPOLIA]: 'eth-sepolia',
      [ChainId.MATIC_MAINNET]: 'matic-mainnet',
      [ChainId.MATIC_AMOY]: 'matic-amoy',
      [ChainId.BSC_MAINNET]: 'bsc-mainnet',
      [ChainId.AVALANCHE_MAINNET]: 'avalanche-mainnet',
      [ChainId.OPTIMISM_MAINNET]: 'optimism-mainnet',
      [ChainId.ARBITRUM_MAINNET]: 'arbitrum-mainnet',
      [ChainId.FANTOM_MAINNET]: 'fantom-mainnet'
    } as Record<ChainId, string>
    return this.fetch(`/${chainIdToChainName[chain]}/address/${wallet}/balance`, { method: 'GET' })
  }

  fetchBids = async (queryParams: GetBidsParameters = {}) => {
    const params = Object.entries(queryParams)
    const searchParams = new URLSearchParams()
    params.forEach(([key, value]) => {
      searchParams.append(key, value.toString())
    })

    return this.fetch<PaginatedResponse<Bid>>(`/v1/bids${params.length ? `?${searchParams.toString()}` : ''}`, { method: 'GET' })
  }

  fetchTrade = async (tradeId: string) => {
    return this.fetch<Trade>(`/v1/trades/${tradeId}`, { method: 'GET' })
  }
}

export const marketplaceAPI = new MarketplaceAPI(MARKETPLACE_SERVER_URL, { retries: retryParams.attempts, retryDelay: retryParams.delay })
