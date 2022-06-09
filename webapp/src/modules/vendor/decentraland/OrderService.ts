import { ethers } from 'ethers'
import { ListingStatus, Network, Order } from '@dcl/schemas'
import {
  ContractName,
  getContract,
  getContractName
} from 'decentraland-transactions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { NFT } from '../../nft/types'
import { orderAPI } from './order/api'
import { VendorName } from '../types'
import { OrderService as OrderServiceInterface } from '../services'

export class OrderService
  implements OrderServiceInterface<VendorName.DECENTRALAND> {
  fetchByNFT(nft: NFT, status?: ListingStatus): Promise<Order[]> {
    return orderAPI.fetchByNFT(nft.contractAddress, nft.tokenId, status)
  }

  async create(
    _wallet: Wallet | null,
    nft: NFT,
    price: number,
    expiresAt: number
  ) {
    const contract = getContract(
      nft.network === Network.ETHEREUM
        ? ContractName.Marketplace
        : ContractName.MarketplaceV2,
      nft.chainId
    )
    return sendTransaction(
      contract,
      'createOrder',
      nft.contractAddress,
      nft.tokenId,
      ethers.utils.parseEther(price.toString()),
      expiresAt
    )
  }

  async execute(
    _wallet: Wallet | null,
    nft: NFT,
    order: Order,
    fingerprint?: string
  ) {
    const contractName = getContractName(order.marketplaceAddress)
    const contract = getContract(contractName, order.chainId)
    if (fingerprint) {
      return sendTransaction(
        contract,
        'safeExecuteOrder',
        nft.contractAddress,
        nft.tokenId,
        order.price,
        fingerprint
      )
    } else {
      return sendTransaction(
        contract,
        'executeOrder',
        nft.contractAddress,
        nft.tokenId,
        order.price
      )
    }
  }

  async cancel(_wallet: Wallet | null, order: Order) {
    const contractName = getContractName(order.marketplaceAddress)
    const contract = getContract(contractName, order.chainId)
    return sendTransaction(
      contract,
      'cancelOrder',
      order.contractAddress,
      order.tokenId
    )
  }

  canSell() {
    return true
  }
}
