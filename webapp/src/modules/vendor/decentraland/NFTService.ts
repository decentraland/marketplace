import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'

import { NFT } from '../../nft/types'
import { Order } from '../../order/types'
import { Account } from '../../account/types'
import { FetchNFTsOptions } from '../../nft/actions'
import { isExpired } from '../../order/utils'
import { ERC721 } from '../../../contracts/ERC721'
import { NFTService as NFTServiceInterface } from '../services'
import { Vendors } from '../types'
import { nftAPI } from './nft/api'

export class NFTService implements NFTServiceInterface {
  async fetch(options: FetchNFTsOptions) {
    const data = await nftAPI.fetch(options)

    const nfts: NFT[] = []
    const accounts: Account[] = []
    const orders: Order[] = []

    for (const result of data.nfts) {
      const { activeOrder: nestedOrder, ...rest } = result

      const nft: NFT = {
        ...rest,
        vendor: Vendors.DECENTRALAND,
        activeOrderId: null
      }

      if (nestedOrder && !isExpired(nestedOrder.expiresAt)) {
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

    return [nfts, accounts, orders, data.total] as const
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

    if (activeOrder && !isExpired(activeOrder.expiresAt)) {
      order = { ...activeOrder, nftId: nft.id }
      nft.activeOrderId = order.id
    }

    return [nft, order] as const
  }

  async transfer(fromAddress: string, toAddress: string, nft: NFT) {
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }

    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(fromAddress)
    const to = Address.fromString(toAddress)

    const erc721 = new ERC721(eth, Address.fromString(nft.contractAddress))

    return erc721.methods
      .transferFrom(from, to, nft.tokenId)
      .send({ from })
      .getTxHash()
  }
}
