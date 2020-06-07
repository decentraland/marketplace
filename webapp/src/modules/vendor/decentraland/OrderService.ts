import { toWei } from 'web3x-es/utils'
import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'

import { Marketplace } from '../../../contracts/Marketplace'
import { contractAddresses } from '../../contract/utils'
import { NFT } from '../../nft/types'
import { Order } from '../../order/types'
import { OrderService as OrderServiceInterface } from '../services'
import { orderAPI } from './order/api'

export class OrderService implements OrderServiceInterface {
  async fetchByNFT(nftId: string) {
    const orders = await orderAPI.fetchByNFT(nftId)
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
    price: number,
    fromAddress: string,
    fingerprint?: string
  ) {
    const marketplace = this.getMarketplaceContract()

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

  private getMarketplaceContract() {
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }

    return new Marketplace(
      eth,
      Address.fromString(contractAddresses.Marketplace)
    )
  }
}
