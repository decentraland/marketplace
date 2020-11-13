import { toWei } from 'web3x-es/utils'
import { Address } from 'web3x-es/address'

import { Bids } from '../../../contracts/Bids'
import { ERC721 } from '../../../contracts/ERC721'
import { ContractFactory } from '../../contract/ContractFactory'
import { Bid } from '../../bid/types'
import { NFT } from '../../nft/types'
import { OrderStatus } from '../../order/types'
import { Vendors } from '../types'
import { BidService as BidServiceInterface } from '../services'
import { ContractService } from './ContractService'
import { bidAPI } from './bid/api'

export class BidService implements BidServiceInterface<Vendors.DECENTRALAND> {
  async fetchBySeller(seller: string) {
    const remoteBids = await bidAPI.fetchBySeller(seller)

    let bids: Bid[] = []
    for (const result of remoteBids) {
      const { nft, ...rest } = result
      bids.push({
        ...rest,
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId
      })
    }

    return bids
  }

  async fetchByBidder(bidder: string) {
    const remoteBids = await bidAPI.fetchByBidder(bidder)

    let bids: Bid[] = []
    for (const result of remoteBids) {
      const { nft, ...rest } = result
      bids.push({
        ...rest,
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId
      })
    }
    return bids
  }

  async fetchByNFT(nft: NFT, status: OrderStatus = OrderStatus.OPEN) {
    const remoteBids = await bidAPI.fetchByNFT(nft.id, status)

    let bids: Bid[] = []
    for (const result of remoteBids) {
      const { nft, ...rest } = result
      bids.push({
        ...rest,
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId
      })
    }
    return bids
  }

  async place(
    nft: NFT,
    price: number,
    expiresAt: number,
    fromAddress: string,
    fingerprint?: string
  ) {
    const bids = await this.getBidContract()

    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(fromAddress)

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

  async accept(bid: Bid, fromAddress: string) {
    const erc721 = await ContractFactory.build(ERC721, bid.contractAddress)

    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(fromAddress)
    const to = Address.fromString(ContractService.contractAddresses.Bids)

    return erc721.methods
      .safeTransferFrom(from, to, bid.tokenId, bid.blockchainId)
      .send({ from })
      .getTxHash()
  }

  async cancel(bid: Bid, fromAddress: string) {
    const bids = await this.getBidContract()

    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const from = Address.fromString(fromAddress)

    return bids.methods
      .cancelBid(Address.fromString(bid.contractAddress), bid.tokenId)
      .send({ from })
      .getTxHash()
  }

  private getBidContract() {
    return ContractFactory.build(Bids, ContractService.contractAddresses.Bids)
  }
}
