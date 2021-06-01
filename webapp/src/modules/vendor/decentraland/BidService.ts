import { toWei } from 'web3x-es/utils'
import { Address } from 'web3x-es/address'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Bids } from '../../../contracts/Bids'
import { ERC721 } from '../../../contracts/ERC721'
import { ContractFactory } from '../../contract/ContractFactory'
import { Bid } from '../../bid/types'
import { NFT } from '../../nft/types'
import { OrderStatus } from '../../order/types'
import { VendorName } from '../types'
import { BidService as BidServiceInterface } from '../services'
import { ContractName } from './ContractService'
import { bidAPI } from './bid/api'
import { getContract } from '../../contract/utils'

export class BidService
  implements BidServiceInterface<VendorName.DECENTRALAND> {
  async fetchBySeller(seller: string) {
    const bids = await bidAPI.fetchBySeller(seller)
    return bids
  }

  async fetchByBidder(bidder: string) {
    const bids = await bidAPI.fetchByBidder(bidder)
    return bids
  }

  async fetchByNFT(nft: NFT, status: OrderStatus = OrderStatus.OPEN) {
    const bids = await bidAPI.fetchByNFT(nft, status)
    return bids
  }

  async place(
    wallet: Wallet | null,
    nft: NFT,
    price: number,
    expiresAt: number,
    fingerprint?: string
  ) {
    const bids = await this.getBidContract()

    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(wallet.address)

    const priceInWei = toWei(price.toString(), 'ether')
    const expiresIn = Math.round((expiresAt - Date.now()) / 1000)

    if (fingerprint) {
      return bids.methods
        .placeBid(
          Address.fromString(nft.contractAddress),
          nft.tokenId,
          priceInWei,
          expiresIn,
          fingerprint
        )
        .send({ from })
        .getTxHash()
    } else {
      return bids.methods
        .placeBid(
          Address.fromString(nft.contractAddress),
          nft.tokenId,
          priceInWei,
          expiresIn
        )
        .send({ from })
        .getTxHash()
    }
  }

  async accept(wallet: Wallet | null, bid: Bid) {
    const erc721 = await ContractFactory.build(ERC721, bid.contractAddress)

    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(wallet.address)
    const bids = getContract({ name: ContractName.BIDS })
    const to = Address.fromString(bids.address)

    return erc721.methods
      .safeTransferFrom(from, to, bid.tokenId, bid.blockchainId)
      .send({ from })
      .getTxHash()
  }

  async cancel(wallet: Wallet | null, bid: Bid) {
    const bids = await this.getBidContract()

    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(wallet.address)

    return bids.methods
      .cancelBid(Address.fromString(bid.contractAddress), bid.tokenId)
      .send({ from })
      .getTxHash()
  }

  private getBidContract() {
    const bids = getContract({ name: ContractName.BIDS })
    return ContractFactory.build(Bids, bids.address)
  }
}
