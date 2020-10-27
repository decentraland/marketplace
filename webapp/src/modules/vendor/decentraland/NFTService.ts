import { Address } from 'web3x-es/address'

import { ERC721 } from '../../../contracts/ERC721'
import { ContractFactory } from '../../contract/ContractFactory'
import { locations } from '../../routing/locations'
import {
  NFT,
  Data,
  NFTsFetchParams,
  NFTsCountParams,
  NFTCategory
} from '../../nft/types'
import { Order } from '../../order/types'
import { Account } from '../../account/types'
import { isExpired } from '../../order/utils'
import { getNFTId } from '../../nft/utils'
import { NFTService as NFTServiceInterface } from '../services'
import { Vendors } from '../types'
import { NFTsFetchFilters } from './nft/types'
import { NFTsFetchFilters as CollectionNFTsFetchFilters } from './collection/types'
import { nftAPI } from './nft/api'
import { collectionAPI } from './collection/api'
import { NFTFragment } from './nft/fragments'
import { NFTFragment as CollectionNFTFragment } from './collection/fragments'
import { ContractService } from './ContractService'
import { MAX_QUERY_SIZE } from './api'

type Filters = NFTsFetchFilters & CollectionNFTsFetchFilters
type Fragment = NFTFragment | CollectionNFTFragment

export class NFTService implements NFTServiceInterface<Vendors.DECENTRALAND> {
  async fetch(params: NFTsFetchParams, filters?: Filters) {
    const [remoteNFTs, total] = await Promise.all([
      this.fetchNFTS(params, filters),
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

    return [nfts, accounts, orders, total] as const
  }

  async count(countParams: NFTsCountParams, filters?: Filters) {
    const params: NFTsFetchParams = {
      ...countParams,
      first: MAX_QUERY_SIZE,
      skip: 0
    }
    const counts = await Promise.all([
      nftAPI.count(params, filters),
      collectionAPI.countNFTs(params, filters)
    ])
    return counts.reduce((count, total) => count + total, 0)
  }

  async fetchOne(contractAddress: string, tokenId: string) {
    let remoteNFT: Fragment = await nftAPI.fetchOne(contractAddress, tokenId)

    if (!remoteNFT) {
      remoteNFT = await collectionAPI.fetchOneNFT(contractAddress, tokenId)
    }

    const nft = this.toNFT(remoteNFT)
    const order = this.toOrder(remoteNFT)

    if (order && !isExpired(order.expiresAt!)) {
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

  toNFT(nft: Fragment): NFT<Vendors.DECENTRALAND> {
    let name: string
    let data: Data<Vendors.DECENTRALAND>
    let category: NFTCategory

    if (this.isCollectionNFT(nft)) {
      const { metadata } = nft as CollectionNFTFragment
      name = metadata.wearable!.name
      data = {
        wearable: metadata.wearable
      }
      category = NFTCategory.WEARABLE
    } else {
      const { parcel, estate, ens, category: nftCategory } = nft as NFTFragment
      name = nft.name
      data = { parcel, estate, ens }
      category = nftCategory
    }

    return {
      id: getNFTId(nft.contractAddress, nft.tokenId),
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      activeOrderId: '',
      owner: nft.owner.address.toLowerCase(),
      name,
      image: nft.image,
      url: locations.nft(nft.contractAddress, nft.tokenId),
      data,
      category,
      vendor: Vendors.DECENTRALAND
    }
  }

  toOrder(nft: Fragment): Order | undefined {
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

  private async fetchNFTS(params: NFTsFetchParams, filters?: Filters) {
    return params.category === NFTCategory.WEARABLE
      ? collectionAPI.fetchNFTs(params, filters)
      : nftAPI.fetch(params, filters)
  }

  private isCollectionNFT(nft: Fragment) {
    return (nft as CollectionNFTFragment).itemBlockchainId !== undefined
  }
}
