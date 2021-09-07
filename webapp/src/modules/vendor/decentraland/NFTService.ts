import { Network } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { NFT, NFTsFetchParams, NFTsCountParams } from '../../nft/types'
import { Account } from '../../account/types'
import ERC721Abi from '../../../contracts/ERC721Abi'
import { NFTService as NFTServiceInterface } from '../services'
import { NFTsFetchFilters } from './nft/types'
import { VendorName } from '../types'
import { nftAPI } from './nft/api'
import { Order } from '../../order/types'

export class NFTService
  implements NFTServiceInterface<VendorName.DECENTRALAND> {
  async fetch(params: NFTsFetchParams, filters?: NFTsFetchFilters) {
    const { data: results, total } = await nftAPI.fetch(params, filters)

    const accounts: Account[] = []
    const nfts: NFT[] = []
    const orders: Order[] = []
    for (const result of results) {
      const address = result.nft.owner
      let account = accounts.find(account => account.id === address)
      if (!account) {
        account = this.toAccount(address)
      }
      account.nftIds.push(result.nft.id)
      nfts.push({ ...result.nft, vendor: VendorName.DECENTRALAND })
      if (result.order) {
        orders.push(result.order)
      }
    }

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

    const contract: ContractData =
      nft.network !== Network.ETHEREUM
        ? {
            ...getContract(ContractName.ERC721CollectionV2, nft.chainId),
            address: nft.contractAddress
          }
        : {
            name: 'ERC721',
            abi: ERC721Abi as any,
            address: nft.contractAddress,
            chainId: nft.chainId,
            version: '1'
          }

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
