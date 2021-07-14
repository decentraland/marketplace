import { Address } from 'web3x-es/address'
import { toWei } from 'web3x-es/utils'
import { ContractName, getContract } from 'decentraland-transactions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Marketplace } from '../../../contracts/Marketplace'
import { ContractFactory } from '../../contract/ContractFactory'
import { NFT } from '../../nft/types'
import { Order, OrderStatus } from '../../order/types'
import { orderAPI } from './order/api'
import { VendorName } from '../types'
import { OrderService as OrderServiceInterface } from '../services'
import { sendTransaction } from '../../wallet/utils'

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
    wallet: Wallet | null,
    nft: NFT,
    price: number,
    expiresAt: number
  ) {
    const contractData = getContract(ContractName.Marketplace, nft.chainId)
    const marketplace = await this.getMarketplaceContract(contractData.address)

    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(wallet.address)

    const createOrder = marketplace.methods.createOrder(
      Address.fromString(nft.contractAddress),
      nft.tokenId,
      toWei(price.toString(), 'ether'),
      expiresAt
    )

    return sendTransaction(createOrder, contractData, from)
  }

  async execute(
    wallet: Wallet | null,
    nft: NFT,
    order: Order,
    fingerprint?: string
  ) {
    const contractData = getContract(ContractName.Marketplace, nft.chainId)
    const marketplace = await this.getMarketplaceContract(contractData.address)
    const { price } = order

    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(wallet.address)

    if (fingerprint) {
      return marketplace.methods
        .safeExecuteOrder(
          Address.fromString(nft.contractAddress),
          nft.tokenId,
          price,
          fingerprint
        )
        .send({ from })
        .getTxHash()
    } else {
      const executeOrder = marketplace.methods.executeOrder(
        Address.fromString(nft.contractAddress),
        nft.tokenId,
        price
      )

      return sendTransaction(executeOrder, contractData, from)
    }
  }

  async cancel(wallet: Wallet | null, nft: NFT) {
    const contractData = getContract(ContractName.Marketplace, nft.chainId)
    const marketplace = await this.getMarketplaceContract(contractData.address)

    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }

    const from = Address.fromString(wallet.address)
    const cancelOrder = marketplace.methods.cancelOrder(
      Address.fromString(nft.contractAddress),
      nft.tokenId
    )

    return sendTransaction(cancelOrder, contractData, from)
  }

  canSell() {
    return true
  }

  private getMarketplaceContract(address: string) {
    return ContractFactory.build(Marketplace, address)
  }
}
