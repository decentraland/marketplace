import { Trade, TradeCreation } from '@dcl/schemas'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ContractName, getContract } from 'decentraland-transactions'
import { getOnChainTrade } from '../../../utils/trades'
import { TradeService as TradeServiceInterface } from '../services'
import { MARKETPLACE_SERVER_URL } from './nft'
import { TradesAPI } from './trades/api'

export class TradeService implements TradeServiceInterface {
  private tradesAPI: TradesAPI

  constructor(getIdentity: () => AuthIdentity | undefined) {
    this.tradesAPI = new TradesAPI(MARKETPLACE_SERVER_URL, { identity: getIdentity, retries: 0 })
  }

  async addTrade(trade: TradeCreation) {
    return this.tradesAPI.addTrade(trade)
  }

  async fetchTrade(tradeId: string) {
    return this.tradesAPI.fetchTrade(tradeId)
  }

  async accept(trade: Trade, sentBeneficiaryAddress: string) {
    const offchainMarketplaceContract = getContract(ContractName.OffChainMarketplace, trade.chainId)
    const tradeToAccept = getOnChainTrade(trade, sentBeneficiaryAddress)
    return sendTransaction(offchainMarketplaceContract, 'accept', [tradeToAccept])
  }

  async cancel(trade: Trade, sentBeneficiaryAddress: string) {
    const offchainMarketplaceContract = getContract(ContractName.OffChainMarketplace, trade.chainId)
    const tradeToCancel = getOnChainTrade(trade, sentBeneficiaryAddress)
    return sendTransaction(offchainMarketplaceContract, 'cancelSignature', [tradeToCancel])
  }
}
