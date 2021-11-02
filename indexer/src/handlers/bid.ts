import { BigInt, Address } from '@graphprotocol/graph-ts'
import {
  BidCreated,
  BidAccepted,
  BidCancelled,
} from '../entities/ERC721Bid/ERC721Bid'
import { Bid, NFT } from '../entities/schema'
import { getNFTId } from '../modules/nft'
import { getBidId } from '../modules/bid'
import { getCategory } from '../modules/category'
import * as status from '../modules/order/status'
import { BID_SALE_TYPE, trackSale } from '../modules/analytics'

export function handleBidCreated(event: BidCreated): void {
  let category = getCategory(event.params._tokenAddress.toHexString())
  let nftId = getNFTId(
    category,
    event.params._tokenAddress.toHexString(),
    event.params._tokenId.toString()
  )
  let id = getBidId(
    event.params._tokenAddress.toHexString(),
    event.params._tokenId.toString(),
    event.params._bidder.toHexString()
  )

  let nft = NFT.load(nftId)
  let bid = new Bid(id)

  if (nft != null) {
    bid.status = status.OPEN
    bid.category = category
    bid.nftAddress = event.params._tokenAddress
    bid.bidder = event.params._bidder
    bid.price = event.params._price
    bid.fingerprint = event.params._fingerprint
    bid.tokenId = event.params._tokenId
    bid.blockchainId = event.params._id.toHexString()
    bid.blockNumber = event.block.number
    bid.expiresAt = event.params._expiresAt.times(BigInt.fromI32(1000))
    bid.createdAt = event.block.timestamp
    bid.updatedAt = event.block.timestamp

    bid.nft = nftId
    bid.seller = Address.fromString(nft.owner)

    bid.save()

    nft.updatedAt = event.block.timestamp
    nft.save()
  }
}

export function handleBidAccepted(event: BidAccepted): void {
  let id = getBidId(
    event.params._tokenAddress.toHexString(),
    event.params._tokenId.toString(),
    event.params._bidder.toHexString()
  )

  let bid = Bid.load(id)
  if (bid == null) {
    return
  }
  let nft = NFT.load(bid.nft)
  if (nft == null) {
    return
  }

  bid.status = status.SOLD
  bid.seller = event.params._seller
  bid.blockNumber = event.block.number
  bid.updatedAt = event.block.timestamp
  bid.save()

  nft.updatedAt = event.block.timestamp
  nft.save()

  trackSale(
    BID_SALE_TYPE,
    event.params._bidder,
    event.params._seller,
    nft.id,
    bid.price,
    event.block.timestamp,
    event.transaction.hash
  )
}

export function handleBidCancelled(event: BidCancelled): void {
  let id = getBidId(
    event.params._tokenAddress.toHexString(),
    event.params._tokenId.toString(),
    event.params._bidder.toHexString()
  )

  let bid = Bid.load(id)
  if (bid == null) {
    return
  }
  let nft = NFT.load(bid.nft)
  if (nft == null) {
    return
  }

  bid.status = status.CANCELLED
  bid.blockNumber = event.block.number
  bid.updatedAt = event.block.timestamp
  bid.save()

  nft.updatedAt = event.block.timestamp
  nft.save()
}
