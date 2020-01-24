import { log } from '@graphprotocol/graph-ts'
import { NFT, Order } from '../../entities/schema'
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

export function updateNFTOrderProperties(nft: NFT, order: Order): NFT {
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
