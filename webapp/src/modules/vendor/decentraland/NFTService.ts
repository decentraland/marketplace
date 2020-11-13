import { Address } from 'web3x-es/address'

import { ERC721 } from '../../../contracts/ERC721'
import { ContractFactory } from '../../contract/ContractFactory'
import { locations } from '../../routing/locations'
import { NFT, NFTsFetchParams, NFTsCountParams } from '../../nft/types'
import { Order } from '../../order/types'
import { Account } from '../../account/types'
import { isExpired } from '../../order/utils'
import { NFTService as NFTServiceInterface } from '../services'
import { NFTsFetchFilters } from './nft/types'
import { Vendors } from '../types'
import { nftAPI } from './nft/api'
import { NFTFragment } from './nft/fragments'
import { ContractService } from './ContractService'
import { MAX_QUERY_SIZE } from './api'

// TODO: remove this once TheGraph is working again as expected
const isBroken = (nft: NFT<Vendors.DECENTRALAND>) => {
  return nft.data[nft.category as keyof typeof nft.data] == null
}

const removeBrokenNFTs = (nfts: NFT<Vendors.DECENTRALAND>[]) => {
  return nfts.filter(nft => !isBroken(nft))
}

export class NFTService implements NFTServiceInterface<Vendors.DECENTRALAND> {
  async fetch(params: NFTsFetchParams, filters?: NFTsFetchFilters) {
    const [remoteNFTs, total] = await Promise.all([
      nftAPI.fetch(params, filters),
      this.count(params, filters)
    ])

    const nfts: NFT<Vendors.DECENTRALAND>[] = []
    const accounts: Account[] = []
    const orders: Order[] = []

    for (const remoteNFT of remoteNFTs) {
      const nft = this.toNFT(remoteNFT)
      const order = this.toOrder(remoteNFT)

      if (order && !isExpired(order.expiresAt!)) {
        nft.activeOrderId = order.id
        orders.push(order)
      }

      const address = nft.owner
      let account = accounts.find(account => account.id === address)
      if (!account) {
        account = this.toAccount(address)
      }
      account.nftIds.push(nft.id)

      nfts.push(nft)
    }

    return [removeBrokenNFTs(nfts), accounts, orders, total] as const
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

    const nft = this.toNFT(remoteNFT)
    const order = this.toOrder(remoteNFT)

    if (order && !isExpired(order.expiresAt!)) {
      nft.activeOrderId = order.id
    }

    if (isBroken(nft)) {
      throw new Error('404')
    }

    return [nft, order] as const
  }

  async transfer(fromAddress: string, toAddress: string, nft: NFT) {
    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(fromAddress)
    const to = Address.fromString(toAddress)

    const erc721 = await ContractFactory.build(ERC721, nft.contractAddress)

    return erc721.methods
      .transferFrom(from, to, nft.tokenId)
      .send({ from })
      .getTxHash()
  }

  toNFT(nft: NFTFragment): NFT<Vendors.DECENTRALAND> {
    return {
      id: nft.id,
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      activeOrderId: '',
      owner: nft.owner.address.toLowerCase(),
      name: nft.name,
      image: nft.image,
      url: locations.nft(nft.contractAddress, nft.tokenId),
      data: {
        parcel: nft.parcel,
        estate: nft.estate,
        wearable: nft.wearable,
        ens: nft.ens
      },
      category: nft.category,
      vendor: Vendors.DECENTRALAND
    }
  }

  toOrder(nft: NFTFragment): Order | undefined {
    let order: Order | undefined

    if (nft.activeOrder) {
      order = {
        ...nft.activeOrder,
        marketAddress: ContractService.contractAddresses.Marketplace,
        nftId: nft.id
      }
    }

    return order
  }

  toAccount(address: string): Account {
    return {
      id: address,
      address,
      nftIds: []
    }
  }
}
