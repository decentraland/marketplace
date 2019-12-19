import { log } from '@graphprotocol/graph-ts'
import { ERC721, Transfer } from '../types/templates/ERC721/ERC721'
import { NFT, Metric } from '../types/schema'
import * as addresses from '../utils/addresses'
import * as categories from '../utils/categories'

export function handleTransfer(event: Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  let metric = Metric.load('all')
  if (metric == null) {
    metric = new Metric('all')
    metric.parcel = 0
    metric.estate = 0
    metric.wearable_halloween_2019 = 0
    metric.wearable_exclusive_masks = 0
  }

  let id = event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  let nft = new NFT(id)

  // Attributes
  nft.tokenId = event.params.tokenId
  nft.owner = event.params.to
  nft.contractAddress = event.address

  // Category
  let address = event.address.toHexString()
  if (address == addresses.LANDRegistry) {
    nft.category = categories.PARCEL
    metric.parcel += 1
  } else if (address == addresses.EstateRegistry) {
    nft.category = categories.ESTATE
    metric.estate += 1
  } else if (address == addresses.ERC721Collection_exclusive_masks) {
    nft.category = categories.WEARABLE
    metric.wearable_exclusive_masks += 1
  } else if (address == addresses.ERC721Collection_halloween_2019) {
    nft.category = categories.WEARABLE
    metric.wearable_halloween_2019 += 1
  }

  // TokenURI
  let erc721 = ERC721.bind(event.address)
  if (nft.category != categories.PARCEL) {
    let tokenURICallResult = erc721.try_tokenURI(event.params.tokenId)
    if (tokenURICallResult.reverted) {
      log.warning(
        'tokenURI reverted for tokenID: {} contract: {} category: {}',
        [
          nft.tokenId.toString(),
          nft.contractAddress.toHexString(),
          nft.category
        ]
      )
    } else {
      nft.tokenURI = tokenURICallResult.value
    }
  }

  nft.save()
  metric.save()
}
