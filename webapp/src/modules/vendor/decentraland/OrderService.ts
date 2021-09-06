import { utils } from 'ethers'
import { ContractName, getContract } from 'decentraland-transactions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { NFT } from '../../nft/types'
import { Order, OrderStatus } from '../../order/types'
import { orderAPI } from './order/api'
import { VendorName } from '../types'
import { OrderService as OrderServiceInterface } from '../services'

export class OrderService
  implements OrderServiceInterface<VendorName.DECENTRALAND> {
  async fetchByNFT(nft: NFT, status?: OrderStatus) {
    const orders = await orderAPI.fetchByNFT(
      nft.contractAddress,
      nft.tokenId,
      status
    )
    return orders as Order[]
  }

  async create(
    _wallet: Wallet | null,
    nft: NFT,
    price: number,
    expiresAt: number
  ) {
    const contract = getContract(ContractName.Marketplace, nft.chainId)
    return sendTransaction(contract, marketplace =>
      marketplace.createOrder(
        nft.contractAddress,
        nft.tokenId,
        utils.parseEther(price.toString()),
        expiresAt
      )
    )
  }

  async execute(
    _wallet: Wallet | null,
    nft: NFT,
    order: Order,
    fingerprint?: string
  ) {
    const contract = getContract(ContractName.Marketplace, nft.chainId)
    if (fingerprint) {
      return sendTransaction(contract, marketplace =>
        marketplace.safeExecuteOrder(
          nft.contractAddress,
          nft.tokenId,
          order.price,
          fingerprint
        )
      )
    } else {
      return sendTransaction(contract, marketplace =>
        marketplace.executeOrder(nft.contractAddress, nft.tokenId, order.price)
      )
    }
  }

  async cancel(_wallet: Wallet | null, nft: NFT) {
    const contract = getContract(ContractName.Marketplace, nft.chainId)
    return sendTransaction(contract, marketplace =>
      marketplace.cancelOrder(nft.contractAddress, nft.tokenId)
    )
  }

  canSell() {
    return true
  }
}
