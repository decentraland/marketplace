import { ChainId } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { config } from '../../../../config'
import { retryParams } from '../utils'
import { Balance } from './types'

export const MARKETPLACE_SERVER_URL = config.get('MARKETPLACE_SERVER_URL')

export class MarketplaceAPI extends BaseAPI {
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
    return this.request('get', `/${chainIdToChainName[chain]}/address/${wallet}/balance`) as Promise<Balance[]>
  }
}

export const marketplaceAPI = new MarketplaceAPI(MARKETPLACE_SERVER_URL, retryParams)
