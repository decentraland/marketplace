import { Trade, TradeCreation } from '@dcl/schemas'
import { BaseClient } from 'decentraland-dapps/dist/lib'
import { config } from '../../../../config'
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
}

export const tradesAPI = new TradesAPI(MARKETPLACE_SERVER_URL, { retries: retryParams.attempts, retryDelay: retryParams.delay })
