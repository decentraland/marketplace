import { ethers } from 'ethers'
import { Network, Order, OrderFilters, OrderSortBy } from '@dcl/schemas'
import { ContractName, getContract, getContractName } from 'decentraland-transactions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { fromMillisecondsToSeconds } from '../../../lib/time'
import { NFT } from '../../nft/types'
import { orderAPI } from './order/api'
import { VendorName } from '../types'
import { OrderService as OrderServiceInterface } from '../services'
import { OrderResponse } from './order/types'

export class OrderService implements OrderServiceInterface<VendorName.DECENTRALAND> {
  async fetchOrders(params: OrderFilters, sortBy: OrderSortBy): Promise<OrderResponse> {
    return orderAPI.fetchOrders(params, sortBy)
  }

  async create(_wallet: Wallet | null, nft: NFT, price: number, expiresAt: number) {
    const contract = getContract(nft.network === Network.ETHEREUM ? ContractName.Marketplace : ContractName.MarketplaceV2, nft.chainId)
    return sendTransaction(
      contract,
      'createOrder',
      nft.contractAddress,
      nft.tokenId,
      ethers.utils.parseEther(price.toString()),
      fromMillisecondsToSeconds(expiresAt)
    )
  }

  async execute(_wallet: Wallet | null, nft: NFT, order: Order, fingerprint?: string) {
    const contractName = getContractName(order.marketplaceAddress)
    const contract = getContract(contractName, order.chainId)
    if (fingerprint) {
      return sendTransaction(contract, 'safeExecuteOrder', nft.contractAddress, nft.tokenId, order.price, fingerprint)
    } else {
      return sendTransaction(contract, 'executeOrder', nft.contractAddress, nft.tokenId, order.price)
    }
  }

  async cancel(_wallet: Wallet | null, order: Order) {
    const contractName = getContractName(order.marketplaceAddress)
    const contract = getContract(contractName, order.chainId)
    return sendTransaction(contract, 'cancelOrder', order.contractAddress, order.tokenId)
  }

  canSell() {
    return true
  }
}
