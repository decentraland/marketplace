import { BigInt, Address } from '@graphprotocol/graph-ts'
import {
  BidCreated,
  BidAccepted,
  BidCancelled
} from '../entities/ERC721Bid/ERC721Bid'
import { Bid, NFT } from '../entities/schema'
import { getNFTId } from '../modules/nft'
import { getCategory } from '../modules/category'
import * as status from '../modules/order/status'
import * as categories from '../modules/category/categories'

export function handleCreated(event: BidCreated): void {
  let category = getCategory(event.params._tokenAddress.toHexString())
  let nftId = getNFTId(event.params._tokenId.toString(), categories.PARCEL)
  let id = event.params._id.toHex()

  let bid = new Bid(id)
  let nft = NFT.load(nftId)

  bid.status = status.OPEN
  bid.category = category
  bid.nftAddress = event.params._tokenAddress
  bid.nft = nft.id
  bid.seller = Address.fromString(nft.owner)
  bid.bidder = event.params._bidder
  bid.price = event.params._price
  bid.fingerprint = event.params._fingerprint
  bid.blockNumber = event.block.number
  bid.expiresAt = event.params._expiresAt.times(BigInt.fromI32(1000))
  bid.createdAt = event.block.timestamp
  bid.updatedAt = event.block.timestamp

  bid.save()
}

export function handleAccepted(event: BidAccepted): void {
  let id = event.params._id.toHex()

  let bid = new Bid(id)
  bid.status = status.SOLD
  bid.seller = event.params._seller
  bid.blockNumber = event.block.number
  bid.updatedAt = event.block.timestamp
  bid.save()
}

export function handleCancelled(event: BidCancelled): void {
  let id = event.params._id.toHex()

  let bid = new Bid(id)
  bid.status = status.CANCELLED
  bid.blockNumber = event.block.number
  bid.updatedAt = event.block.timestamp
  bid.save()
}
