import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { NFT, NFTsFetchParams, NFTsCountParams } from '../../nft/types'
import { Account } from '../../account/types'
import { NFTService as NFTServiceInterface } from '../services'
import { NFTsFetchFilters } from './nft/types'
import { VendorName } from '../types'
import { nftAPI } from './nft/api'
import { Order } from '../../order/types'
import { getERC721ContractData } from './utils'

export class NFTService
  implements NFTServiceInterface<VendorName.DECENTRALAND> {
  async fetch(params: NFTsFetchParams, filters?: NFTsFetchFilters) {
    const { data: results, total } = await nftAPI.fetch(params, filters)

    const accounts: Account[] = results.reduce((accumulator, nftResult) => {
      const address = nftResult.nft.owner
      let account = accumulator.find(account => account.id === address)
      if (!account) {
        account = this.toAccount(address)
        accumulator.push(account)
      }
      account.nftIds.push(nftResult.nft.id)
      return accumulator
    }, [] as Account[])

    const nfts: NFT[] = results.map(nftResult => ({
      ...nftResult.nft,
      vendor: VendorName.DECENTRALAND
    }))

    const orders: Order[] = results
      .filter(nftResult => nftResult.order)
      .map(nftResult => nftResult.order as Order)

    return [nfts, accounts, orders, total] as const
  }

  async count(countParams: NFTsCountParams, filters?: NFTsFetchFilters) {
    const result = await nftAPI.fetch(
      { ...countParams, first: 0, skip: 0 },
      filters
    )
    return result.total
  }

  async fetchOne(contractAddress: string, tokenId: string) {
    const response = await nftAPI.fetchOne(contractAddress, tokenId)
    const nft: NFT = { ...response.nft, vendor: VendorName.DECENTRALAND }
    return [nft, response.order || undefined] as const
  }

  async transfer(wallet: Wallet | null, to: string, nft: NFT) {
    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }

    const contract = getERC721ContractData(nft)

    return sendTransaction(contract, erc721 =>
      erc721.transferFrom(wallet.address, to, nft.tokenId)
    )
  }

  toAccount(address: string): Account {
    return {
      id: address,
      address,
      nftIds: []
    }
  }
}
