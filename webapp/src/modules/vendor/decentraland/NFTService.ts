import { NFT } from '../../nft/types'
import { Order } from '../../order/types'
import { Account } from '../../account/types'
import { FetchNFTsOptions } from '../../nft/actions'
import { isExpired } from '../../order/utils'
import { NFTService as NFTServiceInterface } from '../types'
import { nftAPI } from './nft/api'

export class NFTService implements NFTServiceInterface {
  async fetch(options: FetchNFTsOptions) {
    const data = await nftAPI.fetch(options)

    const nfts: NFT[] = []
    const accounts: Account[] = []
    const orders: Order[] = []

    for (const result of data.nfts) {
      const { activeOrder: nestedOrder, ...rest } = result

      const nft: NFT = { ...rest, activeOrderId: null }

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

    const nft: NFT = { ...rest, activeOrderId: null }

    let order: Order | undefined

    if (activeOrder && !isExpired(activeOrder.expiresAt)) {
      order = { ...activeOrder, nftId: nft.id }
      nft.activeOrderId = order.id
    }

    return [nft, order] as const
  }
}
