import { Bid, ChainId, GetBidsParameters, PaginatedResponse } from '@dcl/schemas'
import { BaseClient } from 'decentraland-dapps/dist/lib'
import { config } from '../../../../config'
import { EstateSizeFilters } from '../nft/api'
import { retryParams } from '../utils'
import { Balance } from './types'

export const MARKETPLACE_SERVER_URL = config.get('MARKETPLACE_SERVER_URL')

export class MarketplaceAPI extends BaseClient {
  fetchWalletTokenBalances = async (chain: ChainId, wallet: string): Promise<Balance[]> => {
    const chainIdToChainName = {
      [ChainId.ETHEREUM_MAINNET]: 'eth-mainnet',
      [ChainId.ETHEREUM_SEPOLIA]: 'eth-sepolia',
      [ChainId.MATIC_MAINNET]: 'matic-mainnet',
      [ChainId.MATIC_AMOY]: 'polygon-amoy-testnet',
      [ChainId.BSC_MAINNET]: 'bsc-mainnet',
      [ChainId.AVALANCHE_MAINNET]: 'avalanche-mainnet',
      [ChainId.OPTIMISM_MAINNET]: 'optimism-mainnet',
      [ChainId.ARBITRUM_MAINNET]: 'arbitrum-mainnet',
      [ChainId.FANTOM_MAINNET]: 'fantom-mainnet'
    } as Record<ChainId, string>
    return this.fetch(`/v1/${chainIdToChainName[chain]}/address/${wallet}/balance`, { method: 'GET' })
  }

  getSearchParams = (filters: Record<string, string | number | boolean | undefined>) => {
    const searchParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
    return searchParams.toString()
  }

  fetchBids = async (queryParams: GetBidsParameters = {}) => {
    const searchParams = this.getSearchParams(queryParams)

    return this.fetch<PaginatedResponse<Bid>>(`/v1/bids${searchParams ? `?${searchParams}` : ''}`, { method: 'GET' })
  }

  fetchEstateSizes = async (filters: EstateSizeFilters): Promise<Record<string, number>> => {
    try {
      return this.fetch(`/v1/stats/estate/size?${this.getSearchParams(filters)}`, { method: 'GET' })
    } catch (error) {
      console.error('Error fetching estate sizes', error)
      return {}
    }
  }
}

export const marketplaceAPI = new MarketplaceAPI(MARKETPLACE_SERVER_URL, { retries: retryParams.attempts, retryDelay: retryParams.delay })
