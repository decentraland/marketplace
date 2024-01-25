import { ChainId } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { Balance } from './types'
import { config } from '../../../../config'
import { retryParams } from '../utils'

export const MARKETPLACE_SERVER_URL = config.get('MARKETPLACE_SERVER_URL')!

export class MarketplaceAPI extends BaseAPI {
  fetchWalletTokenBalances = async (
    chain: ChainId,
    wallet: string
  ): Promise<Balance[]> => {
    const chainIdToChainName = {
      [ChainId.ETHEREUM_MAINNET]: 'eth-mainnet',
      [ChainId.ETHEREUM_SEPOLIA]: 'eth-sepolia',
      [ChainId.MATIC_MAINNET]: 'matic-mainnet',
      [ChainId.MATIC_MUMBAI]: 'matic-mumbai'
    } as Record<ChainId, string>
    const balances = await this.request(
      'get',
      `/${chainIdToChainName[chain]}/address/${wallet}/balance`
    )
    return balances
  }
}

export const marketplaceAPI = new MarketplaceAPI(
  MARKETPLACE_SERVER_URL,
  retryParams
)
