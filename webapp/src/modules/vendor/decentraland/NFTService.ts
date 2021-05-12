import { Address } from 'web3x-es/address'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ContractName, getContract } from 'decentraland-transactions'
import { ERC721 } from '../../../contracts/ERC721'
import { ContractFactory } from '../../contract/ContractFactory'
import { NFT, NFTsFetchParams, NFTsCountParams } from '../../nft/types'
import { sendTransaction } from '../../wallet/utils'
import { Account } from '../../account/types'
import { NFTService as NFTServiceInterface } from '../services'
import { NFTsFetchFilters } from './nft/types'
import { VendorName } from '../types'
import { nftAPI } from './nft/api'

export class NFTService
  implements NFTServiceInterface<VendorName.DECENTRALAND> {
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
      nfts.map(nft => ({ ...nft, vendor: VendorName.DECENTRALAND })),
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
    const response = await nftAPI.fetchOne(contractAddress, tokenId)
    const nft: NFT = { ...response.nft, vendor: VendorName.DECENTRALAND }
    return [nft, response.order || undefined] as const
  }

  async transfer(wallet: Wallet | null, toAddress: string, nft: NFT) {
    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(wallet.address)
    const to = Address.fromString(toAddress)

    const erc721 = await ContractFactory.build(ERC721, nft.contractAddress)
    const contract = {
      ...getContract(ContractName.ERC721CollectionV2, nft.chainId),
      address: nft.contractAddress
    }

    const transferFrom = erc721.methods.transferFrom(from, to, nft.tokenId)
    return sendTransaction(transferFrom, contract, from)
  }

  toAccount(address: string): Account {
    return {
      id: address,
      address,
      nftIds: []
    }
  }
}
