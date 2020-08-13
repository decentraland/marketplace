import { toWei } from 'web3x-es/utils'
import { Address } from 'web3x-es/address'

import { Marketplace } from '../../../contracts/Marketplace'
import { ContractFactory } from '../../contract/ContractFactory'
import { NFT } from '../../nft/types'
import { Order } from '../../order/types'
import { orderAPI } from './order/api'
import { Vendors } from '../types'
import { OrderService as OrderServiceInterface } from '../services'
import { ContractService } from './ContractService'

export class OrderService
  implements OrderServiceInterface<Vendors.DECENTRALAND> {
  async fetchByNFT(nft: NFT) {
    const orders = await orderAPI.fetchByNFT(nft.id)
    return orders as Order[]
  }

  async create(
    nft: NFT,
    price: number,
    expiresAt: number,
    fromAddress: string
  ) {
    const marketplace = this.getMarketplaceContract()

    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(fromAddress)

    return marketplace.methods
      .createOrder(
        Address.fromString(nft.contractAddress),
        nft.tokenId,
        toWei(price.toString(), 'ether'),
        expiresAt
      )
      .send({ from })
      .getTxHash()
  }

  async execute(
    nft: NFT,
    order: Order,
    fromAddress: string,
    fingerprint?: string
  ) {
    const marketplace = this.getMarketplaceContract()
    const { price } = order

    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(fromAddress)

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
      return marketplace.methods
        .executeOrder(
          Address.fromString(nft.contractAddress),
          nft.tokenId,
          price
        )
        .send({ from })
        .getTxHash()
    }
  }

  async cancel(nft: NFT, fromAddress: string) {
    const marketplace = this.getMarketplaceContract()

    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }

    const from = Address.fromString(fromAddress)
    return marketplace.methods
      .cancelOrder(Address.fromString(nft.contractAddress), nft.tokenId)
      .send({ from })
      .getTxHash()
  }

  canSell() {
    return true
  }

  private getMarketplaceContract() {
    return ContractFactory.build(
      Marketplace,
      ContractService.contractAddresses.Marketplace
    )
  }
}
