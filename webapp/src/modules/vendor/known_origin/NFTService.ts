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

import { NFTsFetchFilters } from './nft/types'
import { ContractService } from './ContractService'
import { EditionFragment } from './edition/fragments'
import { TokenFragment } from './token/fragments'
import { editionAPI } from './edition/api'
import { tokenAPI } from './token/api'
import { MAX_QUERY_SIZE } from './api'
import { AssetType } from './types'

type Fragment = TokenFragment | EditionFragment

export class NFTService implements NFTServiceInterface<Vendors.KNOWN_ORIGIN> {
  private tokenConverter: TokenConverter
  private marketplacePrice: MarketplacePrice
  private oneEthInWei: BN

  constructor() {
    this.tokenConverter = new TokenConverter()
    this.marketplacePrice = new MarketplacePrice()
    this.oneEthInWei = new BN('1000000000000000000') // 10 ** 18
  }

  async fetch(params: NFTsFetchParams, filters?: NFTsFetchFilters) {
    const fragments = await this.getAPI(filters).fetch(params)
    const [total, oneEthInMANA] = await Promise.all([
      this.count(params, filters),
      this.getOneEthInMANA()
    ])

    const nfts: NFT<Vendors.KNOWN_ORIGIN>[] = []
    const accounts: Account[] = []
    const orders: Order[] = []

    for (const fragment of fragments) {
      const nft = this.toNFT(fragment)

      if (fragment.type === AssetType.EDITION) {
        const order = this.toOrder(fragment, oneEthInMANA)

        nft.activeOrderId = order.id
        order.nftId = nft.id

        orders.push(order)
      }

      let account = accounts.find(account => account.id === nft.owner)
      if (!account) {
        account = this.toAccount(nft.owner)
      }
      account.nftIds.push(nft.id)

      nfts.push(nft)
      accounts.push(account)
    }

    return [nfts, accounts, orders, total] as const
  }

  async count(countParams: NFTsCountParams, filters?: NFTsFetchFilters) {
    const params: NFTsFetchParams = {
      ...countParams,
      first: MAX_QUERY_SIZE,
      skip: 0
    }
    if (!filters) {
      const [editionCount, tokenCount] = await Promise.all([
        tokenAPI.count(params),
        editionAPI.count(params)
      ])
      return editionCount + tokenCount
    } else {
      return this.getAPI(filters).count(params)
    }
  }

  async fetchOne(_contractAddress: string, tokenId: string) {
    const fragment = await this.getAPI().fetchOne(tokenId)
    const oneEthInMANA = await this.getOneEthInMANA()

    const nft = this.toNFT(fragment)
    let order: Order | undefined

    if (fragment.type === AssetType.EDITION) {
      order = this.toOrder(fragment, oneEthInMANA)

      nft.activeOrderId = order.id
      order.nftId = nft.id
    }

    return [nft, order] as const
  }

  async transfer(
    fromAddress: string,
    toAddress: string,
    nft: NFT<Vendors.KNOWN_ORIGIN>
  ) {
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

  toNFT(fragment: Fragment): NFT<Vendors.KNOWN_ORIGIN> {
    const tokenId = fragment.id
    const { name, description, image } = fragment.metadata

    const nftAddress = ContractService.contractAddresses.DigitalAsset

    return {
      id: getNFTId(nftAddress, tokenId),
      tokenId,
      contractAddress: nftAddress,
      activeOrderId: '',
      owner: this.getOwner(fragment),
      name,
      image,
      url: this.getDefaultURL(fragment),
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

  private getAPI(filters?: NFTsFetchFilters) {
    return filters && filters.isToken ? tokenAPI : editionAPI
  }

  private async getOneEthInMANA() {
    const mana = await this.tokenConverter.marketEthToMANA(1)
    return toWei(mana.toString(), 'ether')
  }

  private getOwner(fragment: Fragment): string {
    return fragment.type === AssetType.TOKEN
      ? fragment.currentOwner.id
      : fragment.artistAccount
  }

  private getDefaultURL(fragment: Fragment): string {
    const origin = getOriginURL(Vendors.KNOWN_ORIGIN)
    return `${origin}/${fragment.type}/${fragment.id}`
  }
}
