import BN from 'bn.js'
import { Address } from 'web3x-es/address'
import { toBN, toWei } from 'web3x-es/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Network } from '@dcl/schemas'
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
import { getContractNames, VendorName } from '../types'
import { getContract } from '../../contract/utils'
import { NFTsFetchFilters } from './nft/types'
import { EditionFragment } from './edition/fragments'
import { TokenFragment } from './token/fragments'
import { editionAPI } from './edition/api'
import { tokenAPI } from './token/api'
import { MAX_QUERY_SIZE } from './api'
import { AssetType } from './types'

type Fragment = TokenFragment | EditionFragment

export class NFTService
  implements NFTServiceInterface<VendorName.KNOWN_ORIGIN> {
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

    const nfts: NFT<VendorName.KNOWN_ORIGIN>[] = []
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
    wallet: Wallet | null,
    toAddress: string,
    nft: NFT<VendorName.KNOWN_ORIGIN>
  ) {
    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(wallet.address)
    const to = Address.fromString(toAddress)

    const erc721 = await ContractFactory.build(ERC721, nft.contractAddress)

    return erc721.methods
      .transferFrom(from, to, nft.tokenId)
      .send({ from })
      .getTxHash()
  }

  toNFT(fragment: Fragment): NFT<VendorName.KNOWN_ORIGIN> {
    const tokenId = fragment.id
    const { name, description, image } = fragment.metadata

    const contractNames = getContractNames()

    const nftAddress = getContract({
      name: contractNames.DIGITAL_ASSET
    }).address

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
      vendor: VendorName.KNOWN_ORIGIN,
      chainId: Number(process.env.REACT_APP_CHAIN_ID),
      network: Network.ETHEREUM
    }
  }

  toOrder(edition: EditionFragment, oneEthInMANA: string): Order {
    const totalWei = this.marketplacePrice.addFee(edition.priceInWei)
    const weiPrice = toBN(totalWei).mul(toBN(oneEthInMANA))
    const price = weiPrice.div(this.oneEthInWei)

    const contractNames = getContractNames()

    const nftAddress = getContract({
      name: contractNames.DIGITAL_ASSET
    }).address
    const marketAddress = getContract({
      name: contractNames.MARKETPLACE_ADAPTER
    }).address

    return {
      id: `${VendorName.KNOWN_ORIGIN}-order-${edition.id}`,
      nftId: edition.id,
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
    const origin = getOriginURL(VendorName.KNOWN_ORIGIN)
    return `${origin}/${fragment.type}/${fragment.id}`
  }
}
