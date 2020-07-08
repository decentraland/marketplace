import { Address } from 'web3x-es/address'

import { ERC721 } from '../../../contracts/ERC721'
import { ContractFactory } from '../../contract/ContractFactory'
import { NFT, NFTsFetchParams, NFTsCountParams } from '../../nft/types'
import { Order } from '../../order/types'
import { Account } from '../../account/types'
import { isExpired } from '../../order/utils'
import { NFTService as NFTServiceInterface } from '../services'
import { NFTsFetchFilters } from '../nft/types'
import { Vendors } from '../types'
import { MAX_QUERY_SIZE } from './api'
import { nftAPI } from './nft/api'

export class NFTService implements NFTServiceInterface {
  async fetch(params: NFTsFetchParams, filters?: NFTsFetchFilters) {
    const [remoteNFTs, total] = await Promise.all([
      nftAPI.fetch(params, filters),
      this.count(params, filters)
    ])

    const nfts: NFT[] = []
    const accounts: Account[] = []
    const orders: Order[] = []

    for (const result of remoteNFTs) {
      const { activeOrder: nestedOrder, ...rest } = result

      const nft: NFT = {
        ...rest,
        vendor: Vendors.DECENTRALAND,
        activeOrderId: null
      }

      if (nestedOrder && !isExpired(nestedOrder.expiresAt!)) {
        const order = { ...nestedOrder, nftId: nft.id }
        nft.activeOrderId = order.id
        orders.push(order)
      }

      const address = nft.owner.address.toLowerCase()
      const account = accounts.find(account => account.id === address)
      if (account) {
        account.nftIds.push(nft.id)
      } else {
        accounts.push({ id: address, address, nftIds: [nft.id] })
      }

      nfts.push(nft)
    }

    return [nfts, accounts, orders, total] as const
  }

  async count(countParams: NFTsCountParams, filters?: NFTsFetchFilters) {
    const params: NFTsFetchParams = {
      ...countParams,
      first: MAX_QUERY_SIZE,
      skip: 0
    }
    return nftAPI.count(params, filters)
  }

  async fetchOne(contractAddress: string, tokenId: string) {
    const remoteNFT = await nftAPI.fetchOne(contractAddress, tokenId)

    const { activeOrder, ...rest } = remoteNFT

    const nft: NFT = {
      ...rest,
      vendor: Vendors.DECENTRALAND,
      activeOrderId: null
    }

    let order: Order | undefined

    if (activeOrder && !isExpired(activeOrder.expiresAt!)) {
      order = { ...activeOrder, nftId: nft.id }
      nft.activeOrderId = order.id
    }

    return [nft, order] as const
  }

  async transfer(fromAddress: string, toAddress: string, nft: NFT) {
    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(fromAddress)
    const to = Address.fromString(toAddress)

    const erc721 = ContractFactory.build(ERC721, nft.contractAddress)

    return erc721.methods
      .transferFrom(from, to, nft.tokenId)
      .send({ from })
      .getTxHash()
  }
}
