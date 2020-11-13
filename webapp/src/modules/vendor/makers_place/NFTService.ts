import BN from 'bn.js'
import { Address } from 'web3x-es/address'
import { toBN, toWei } from 'web3x-es/utils'

import { ERC721 } from '../../../contracts/ERC721'
import { ContractFactory } from '../../contract/ContractFactory'
import {
  NFT,
  NFTCategory,
  NFTsFetchParams,
  NFTsCountParams
} from '../../nft/types'
import { Order, OrderStatus } from '../../order/types'
import { Account } from '../../account/types'
import { getNFTId } from '../../nft/utils'
import { TokenConverter } from '../TokenConverter'
import { MarketplacePrice } from '../MarketplacePrice'
import { NFTService as NFTServiceInterface } from '../services'
import { getOriginURL } from '../utils'
import { Vendors } from '../types'
import { MakersPlaceAsset } from './types'
import { makersPlaceAPI } from './api'

export class NFTService implements NFTServiceInterface<Vendors.MAKERS_PLACE> {
  private tokenConverter: TokenConverter
  private marketplacePrice: MarketplacePrice
  private oneEthInWei: BN

  constructor() {
    this.tokenConverter = new TokenConverter()
    this.marketplacePrice = new MarketplacePrice()
    this.oneEthInWei = new BN('1000000000000000000') // 10 ** 18
  }

  async fetch(params: NFTsFetchParams) {
    const [response, oneEthInMANA] = await Promise.all([
      makersPlaceAPI.fetch(params),
      this.getOneEthInMANA()
    ])
    const total = response.total_items

    const remoteNFTs = response.items

    const nfts: NFT<Vendors.MAKERS_PLACE>[] = []
    const accounts: Account[] = []
    const orders: Order[] = []

    for (const asset of remoteNFTs) {
      if (!this.isValid(asset)) {
        continue
      }
      const nft = this.toNFT(asset)

      if (this.isOnSale(asset)) {
        const order = this.toOrder(asset, oneEthInMANA)

        nft.activeOrderId = order.id
        order.nftId = nft.id

        orders.push(order)
      }

      let account = accounts.find(account => account.id === asset.owner)
      if (!account) {
        account = this.toAccount(asset.owner)
      }
      account.nftIds.push(nft.id)

      nfts.push(nft)
      accounts.push(account)
    }

    return [nfts, accounts, orders, total] as const
  }

  async count(countParams: NFTsCountParams) {
    const params: NFTsFetchParams = {
      ...countParams,
      first: 1,
      skip: 0
    }
    const response = await makersPlaceAPI.fetch(params)
    return response.total_items
  }

  async fetchOne(contractAddress: string, tokenId: string) {
    const [response, oneEthInMANA] = await Promise.all([
      makersPlaceAPI.fetchOne(contractAddress, tokenId),
      this.getOneEthInMANA()
    ])

    const remoteNFT = response.item
    if (!this.isValid(remoteNFT)) {
      throw new Error(
        `Invalid asset for contract "${contractAddress}" and id "${tokenId}"`
      )
    }

    const nft = this.toNFT(remoteNFT)
    let order: Order | undefined

    if (this.isOnSale(remoteNFT)) {
      order = this.toOrder(remoteNFT, oneEthInMANA)

      nft.activeOrderId = order.id
      order.nftId = nft.id
    }

    return [nft, order] as const
  }

  async transfer(
    fromAddress: string,
    toAddress: string,
    nft: NFT<Vendors.MAKERS_PLACE>
  ) {
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

  toNFT(asset: MakersPlaceAsset): NFT<Vendors.MAKERS_PLACE> {
    const tokenId = asset.token_id!.toString()
    const contractAddress = asset.token_contract_address.toLowerCase()
    return {
      id: getNFTId(contractAddress, tokenId),
      tokenId,
      contractAddress,
      activeOrderId: '',
      owner: asset.owner,
      name: asset.name,
      image: asset.image_url,
      url: asset.url || this.getDefaultURL(asset),
      data: {
        description: asset.description
      },
      category: NFTCategory.ART,
      vendor: Vendors.MAKERS_PLACE
    }
  }

  toOrder(asset: MakersPlaceAsset, oneEthInMANA: string): Order {
    const totalWei = this.marketplacePrice.addFee(asset.price_in_wei!)
    const weiPrice = toBN(totalWei).mul(toBN(oneEthInMANA))
    const price = weiPrice.div(this.oneEthInWei)

    return {
      id: `${Vendors.MAKERS_PLACE}-order-${asset.token_id}`,
      nftId: asset.token_id!.toString(),
      category: NFTCategory.ART,
      nftAddress: asset.token_contract_address.toLowerCase(),
      marketAddress: asset.sale_contract_address!,
      owner: asset.owner,
      buyer: null,
      price: price.toString(10),
      ethPrice: asset.price_in_wei!.toString(),
      status: OrderStatus.OPEN,
      createdAt: asset.sale_created_at!,
      updatedAt: asset.sale_created_at!
    }
  }

  toAccount(address: string): Account {
    return {
      id: address,
      address,
      nftIds: []
    }
  }

  private async getOneEthInMANA() {
    const mana = await this.tokenConverter.marketEthToMANA(1)
    return toWei(mana.toString(), 'ether')
  }

  private isValid(asset: MakersPlaceAsset) {
    // For some reason, the API *sometimes* returns null on token_ids
    // We need to either skip or just throw when we found these
    return asset.token_id !== null
  }

  private isOnSale(asset: MakersPlaceAsset): boolean {
    return (
      asset.price_in_wei !== undefined &&
      asset.sale_contract_address !== undefined
    )
  }

  private getDefaultURL(asset: MakersPlaceAsset): string {
    const origin = getOriginURL(Vendors.MAKERS_PLACE)
    return `${origin}/authenticity/${asset.token_contract_address}/${asset.token_id}`
  }
}
