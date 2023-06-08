import { parseUnits } from '@ethersproject/units'
import { Bid, ListingStatus, Network } from '@dcl/schemas'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { NFT } from '../../nft/types'
import { VendorName } from '../types'
import { BidService as BidServiceInterface } from '../services'
import { bidAPI } from './bid/api'
import { getERC721ContractData } from './utils'

export class BidService
  implements BidServiceInterface<VendorName.DECENTRALAND> {
  async fetchBySeller(seller: string) {
    const bids = await bidAPI.fetchBySeller(seller)
    return bids.data
  }

  async fetchByBidder(bidder: string) {
    const bids = await bidAPI.fetchByBidder(bidder)
    return bids.data
  }

  async fetchByNFT(nft: NFT, status: ListingStatus = ListingStatus.OPEN) {
    const bids = await bidAPI.fetchByNFT(
      nft.contractAddress,
      nft.tokenId,
      status
    )
    return bids.data
  }

  async place(
    wallet: Wallet | null,
    nft: NFT,
    price: number,
    expiresAt: number,
    fingerprint?: string
  ) {
    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }

    const priceInWei = parseUnits(price.toString(), 'ether')
    const expiresIn = Math.round((expiresAt - Date.now()) / 1000)

    switch (nft.network) {
      case Network.ETHEREUM: {
        const contract: ContractData = getContract(
          ContractName.Bid,
          nft.chainId
        )

        if (fingerprint) {
          return sendTransaction(
            contract,
            'placeBid(address,uint256,uint256,uint256,bytes)',
            nft.contractAddress,
            nft.tokenId,
            priceInWei,
            expiresIn,
            fingerprint
          )
        }

        return sendTransaction(
          contract,
          'placeBid(address,uint256,uint256,uint256)',
          nft.contractAddress,
          nft.tokenId,
          priceInWei,
          expiresIn
        )
      }
      case Network.MATIC: {
        const contract: ContractData = getContract(
          ContractName.BidV2,
          nft.chainId
        )
        return sendTransaction(
          contract,
          'placeBid(address,uint256,uint256,uint256)',
          nft.contractAddress,
          nft.tokenId,
          priceInWei,
          expiresIn
        )
      }
    }
  }

  async accept(wallet: Wallet | null, bid: Bid) {
    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }

    const contract: ContractData = getERC721ContractData(bid)

    return sendTransaction(
      contract,
      'safeTransferFrom(address,address,uint256,bytes)',
      wallet.address,
      bid.bidAddress,
      bid.tokenId,
      bid.blockchainId
    )
  }

  async cancel(wallet: Wallet | null, bid: Bid) {
    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }

    const contract: ContractData =
      bid.network === Network.ETHEREUM
        ? getContract(ContractName.Bid, bid.chainId)
        : getContract(ContractName.BidV2, bid.chainId)
    return sendTransaction(
      contract,
      'cancelBid(address,uint256)',
      bid.contractAddress,
      bid.tokenId
    )
  }
}
