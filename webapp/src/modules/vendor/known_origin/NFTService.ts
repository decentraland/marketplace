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

import { ContractService } from './ContractService'
import { EditionFragment } from './edition/fragments'
import { editionAPI } from './edition/api'
import { MAX_QUERY_SIZE } from './api'

export class NFTService implements NFTServiceInterface {
  private tokenConverter: TokenConverter
  private marketplacePrice: MarketplacePrice
  private oneEthInWei: BN

  constructor() {
    this.tokenConverter = new TokenConverter()
    this.marketplacePrice = new MarketplacePrice()
    this.oneEthInWei = new BN('1000000000000000000') // 10 ** 18
  }

  async fetch(params: NFTsFetchParams) {
    const [editions, total, oneEthInMANA] = await Promise.all([
      editionAPI.fetch(params),
      this.count(params),
      this.getOneEthInMANA()
    ])

    const nfts: NFT<Vendors.KNOWN_ORIGIN>[] = []
    const accounts: Account[] = []
    const orders: Order[] = []

    for (const edition of editions) {
      const nft = this.toNFT(edition)

      const order = this.toOrder(edition, oneEthInMANA)

      nft.activeOrderId = order.id
      order.nftId = nft.id

      orders.push(order)

      let account = accounts.find(
        account => account.id === edition.artistAccount
      )
      if (!account) {
        account = this.toAccount(edition.artistAccount)
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
      first: MAX_QUERY_SIZE,
      skip: 0
    }
    return editionAPI.count(params)
  }

  async fetchOne(_contractAddress: string, tokenId: string) {
    const [remoteNFT, oneEthInMANA] = await Promise.all([
      editionAPI.fetchOne(tokenId),
      this.getOneEthInMANA()
    ])

    const nft = this.toNFT(remoteNFT)
    const order: Order = this.toOrder(remoteNFT, oneEthInMANA)

    nft.activeOrderId = order.id
    order.nftId = nft.id

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

  toNFT(edition: EditionFragment): NFT<Vendors.KNOWN_ORIGIN> {
    const tokenId = edition.id
    const { name, description, image } = edition.metadata

    const nftAddress = ContractService.contractAddresses.DigitalAsset

    return {
      id: getNFTId(nftAddress, tokenId),
      tokenId,
      contractAddress: nftAddress,
      activeOrderId: '',
      owner: edition.artistAccount,
      name,
      image,
      url: this.getDefaultEditionURL(edition),
      data: {
        description,
        isEdition: true
      },
      category: NFTCategory.ART,
      vendor: Vendors.KNOWN_ORIGIN
    }
  }

  toOrder(edition: EditionFragment, oneEthInMANA: string): Order {
    const totalWei = this.marketplacePrice.addFee(edition.priceInWei)
    const weiPrice = toBN(totalWei).mul(toBN(oneEthInMANA))
    const price = weiPrice.div(this.oneEthInWei)

    const nftAddress = ContractService.contractAddresses.DigitalAsset
    const marketAddress = ContractService.contractAddresses.BuyAdapter

    return {
      id: `${Vendors.KNOWN_ORIGIN}-order-${edition.id}`,
      nftId: edition.id,
      category: NFTCategory.ART,
      nftAddress,
      marketAddress,
      owner: edition.artistAccount,
      buyer: null,
      price: price.toString(10),
      ethPrice: edition.priceInWei.toString(),
      status: OrderStatus.OPEN,
      createdAt: edition.createdTimestamp,
      updatedAt: edition.createdTimestamp
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

  private getDefaultEditionURL(edition: EditionFragment): string {
    const origin = getOriginURL(Vendors.KNOWN_ORIGIN)
    return `${origin}/edition/${edition.id}`
  }
}
