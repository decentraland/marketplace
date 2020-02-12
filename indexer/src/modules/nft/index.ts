import { log, BigInt } from '@graphprotocol/graph-ts'
import { NFT, Order, Bid } from '../../entities/schema'
import { ERC721, Transfer } from '../../entities/templates/ERC721/ERC721'
import * as status from '../order/status'
import * as addresses from '../../data/addresses'

export function isMint(event: Transfer): boolean {
  return event.params.from.toHexString() == addresses.Null
}

export function getNFTId(
  category: string,
  contractAddress: string,
  tokenId: string
): string {
  return category + '-' + contractAddress + '-' + tokenId
}

export function getTokenURI(event: Transfer): string {
  let erc721 = ERC721.bind(event.address)
  let tokenURICallResult = erc721.try_tokenURI(event.params.tokenId)

  let tokenURI = ''

  if (tokenURICallResult.reverted) {
    log.warning('tokenURI reverted for tokenID: {} contract: {}', [
      event.params.tokenId.toString(),
      event.address.toHexString()
    ])
  } else {
    tokenURI = tokenURICallResult.value
  }

  return tokenURI
}

export function upsertNFTOrderProperties(nft: NFT, order: Order): NFT {
  nft.searchOrderStatus = order.status

  if (order.status == status.OPEN) {
    nft.activeOrder = order.id
    nft.searchOrderPrice = order.price
    nft.searchOrderCreatedAt = order.createdAt
    nft.searchOrderExpiresAt = order.expiresAt
  } else if (order.status == status.SOLD || order.status == status.CANCELLED) {
    nft.activeOrder = null
    nft.searchOrderPrice = null
    nft.searchOrderCreatedAt = null
    nft.searchOrderExpiresAt = null
  }

  return nft
}

export function cancelActiveOrder(nft: NFT, now: BigInt): void {
  let oldOrder = Order.load(nft.activeOrder)
  if (oldOrder != null && oldOrder.status == status.OPEN) {
    // Here we are setting old orders as cancelled, because the smart contract allows new orders to be created
    // and they just overwrite them in place. But the subgraph stores all orders ever
    // you can also overwrite ones that are expired
    oldOrder.status = status.CANCELLED
    oldOrder.updatedAt = now
    oldOrder.save()
  }
}

export function cancelActiveBids(nft: NFT, now: BigInt): void {
  let bids = nft.bids as Array<string>
  for (let index = 0; index < bids.length; index++) {
    let bid = Bid.load(bids[index])

    if (bid != null && bid.nft == nft.id && bid.status == status.OPEN) {
      bid.status = status.CANCELLED
      bid.updatedAt = now
      bid.save()
    }
  }
}
