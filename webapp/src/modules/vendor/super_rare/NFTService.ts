import { toBN, toWei, fromWei } from 'web3x-es/utils'
import { NFT, NFTsFetchParams, NFTCategory } from '../../nft/types'
import { Order, OrderStatus } from '../../order/types'
import { Account } from '../../account/types'
import { getNFTId } from '../../nft/utils'
import { NFTService as NFTServiceInterface } from '../services'
import { Vendors } from '../types'
import { SuperRareAsset, SuperRareOrder, SuperRareOwner } from './types'
import { superRareAPI } from './api'
import { Partner } from '../Partner'

export class NFTService implements NFTServiceInterface {
  private partner: Partner

  constructor() {
    this.partner = new Partner()
  }

  async fetch(params: NFTsFetchParams) {
    const remoteOrders = await superRareAPI.fetchOrders(params)
    const nfts: NFT[] = []
    const accounts: Account[] = []
    const orders: Order[] = []

    const oneEthInMANA = await this.getOneEthInMANA()

    for (const remoteOrder of remoteOrders) {
      const asset = remoteOrder.asset

      const order = this.toOrder(remoteOrder, oneEthInMANA)
      const nft = this.toNFT(asset)

      nft.activeOrderId = order.id

      let account = accounts.find(account => account.id === asset.owner.address)
      if (!account) {
        account = this.toAccount(asset.owner)
      }
      account.nftIds.push(nft.id)

      nfts.push(nft)
      orders.push(order)
      accounts.push(account)
    }

    return [nfts, accounts, orders, 1000] as const
  }

  async fetchOne(contractAddress: string, tokenId: string) {
    const [remoteNFT, remoteOrder, oneEthInMANA] = await Promise.all([
      superRareAPI.fetchNFT(contractAddress, tokenId),
      superRareAPI.fetchOrder(contractAddress, tokenId),
      this.getOneEthInMANA()
    ])
    const nft = this.toNFT(remoteNFT)
    const order = this.toOrder(remoteOrder, oneEthInMANA)

    nft.activeOrderId = order.id

    return [nft, order] as const
  }

  transfer(): any {
    throw new Error('Method: `transfer` is not implemented')
  }

  toNFT(asset: SuperRareAsset): NFT {
    return {
      id: getNFTId(asset.contractAddress, asset.id.toString())!,
      tokenId: asset.id.toString(),
      contractAddress: asset.contractAddress,
      activeOrderId: '',
      owner: {
        address: asset.owner.address
      },
      name: asset.name,
      image: asset.image,
      parcel: null,
      estate: null,
      wearable: null,
      ens: null,
      pictureFrame: {
        description: asset.description
      },
      category: NFTCategory.PICTURE_FRAME,
      vendor: Vendors.SUPER_RARE
    }
  }

  toOrder(order: SuperRareOrder, oneEthInMANA: string): Order {
    const { asset, taker } = order

    const totalWei = this.partner.addMarketplaceFee(order.amountWithFee) // Superrare fee AND Marketplace fee
    const price = toBN(totalWei).mul(toBN(oneEthInMANA))

    return {
      id: `${Vendors.SUPER_RARE}-order-${asset.id}`,
      nftId: asset.id.toString(),
      category: NFTCategory.PICTURE_FRAME,
      nftAddress: asset.contractAddress,
      owner: asset.owner.address,
      buyer: taker ? taker.address : null,
      price: fromWei(price, 'ether').toString(),
      status: OrderStatus.OPEN,
      createdAt: order.timestamp,
      updatedAt: order.timestamp
    }
  }

  toAccount(account: SuperRareOwner): Account {
    return {
      id: account.address,
      address: account.address,
      nftIds: []
    }
  }

  private async getOneEthInMANA() {
    const mana = await this.partner.ethToMANA(1)
    return toWei(mana.toString(), 'ether')
  }
}
