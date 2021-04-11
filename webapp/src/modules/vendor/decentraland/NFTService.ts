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

export class NFTService implements NFTServiceInterface<Vendors.DECENTRALAND> {
  async fetch(params: NFTsFetchParams, filters?: NFTsFetchFilters) {
    const { nfts, orders, total } = await nftAPI.fetch(params, filters)

    const accounts: Account[] = []
    for (const nft of nfts) {
      const address = nft.owner
      let account = accounts.find(account => account.id === address)
      if (!account) {
        account = this.toAccount(address)
      }
      account.nftIds.push(nft.id)
    }

    return [
      nfts.map(nft => ({ ...nft, vendor: Vendors.DECENTRALAND })),
      accounts,
      orders,
      total
    ] as const
  }

  async count(countParams: NFTsCountParams, filters?: NFTsFetchFilters) {
    const result = await nftAPI.fetch(
      { ...countParams, first: 0, skip: 0 },
      filters
    )
    return result.total
  }

  async fetchOne(contractAddress: string, tokenId: string) {
    const remoteNFT = await nftAPI.fetchOne(contractAddress, tokenId)

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
