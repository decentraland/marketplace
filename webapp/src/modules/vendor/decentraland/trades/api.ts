import { Trade, TradeCreation } from '@dcl/schemas'
import { BaseClient } from 'decentraland-dapps/dist/lib'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { ContractName, getContract } from 'decentraland-transactions'
import { config } from '../../../../config'
import { getContractTrade } from '../../../../utils/trades'
import { retryParams } from '../utils'

export const MARKETPLACE_SERVER_URL = config.get('MARKETPLACE_SERVER_URL')

export class TradesAPI extends BaseClient {
  addTrade = async (trade: TradeCreation) => {
    return this.fetch<Trade>('/v1/trades', {
      method: 'POST',
      body: JSON.stringify(trade),
      metadata: { signer: 'dcl:marketplace', intent: 'dcl:marketplace:create-trade' },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  fetchTrade = async (tradeId: string) => {
    return this.fetch<Trade>(`/v1/trades/${tradeId}`, { method: 'GET' })
  }

  accept = async (trade: Trade) => {
    const offchainMarketplaceContract = getContract(ContractName.OffChainMarketplace, trade.chainId)
    const tradeToAccept = getContractTrade(trade)
    return sendTransaction(offchainMarketplaceContract, 'accept', [tradeToAccept])
  }

  cancel = async (trade: Trade) => {
    const offchainMarketplaceContract = getContract(ContractName.OffChainMarketplace, trade.chainId)
    const tradeToCancel = getContractTrade(trade)
    return sendTransaction(offchainMarketplaceContract, 'cancelSignature', [tradeToCancel])
  }
}

export const tradesAPI = new TradesAPI(MARKETPLACE_SERVER_URL, { retries: retryParams.attempts, retryDelay: retryParams.delay })
