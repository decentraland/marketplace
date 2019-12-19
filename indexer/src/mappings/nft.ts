import { log } from '@graphprotocol/graph-ts'
import { ERC721, Transfer } from '../types/templates/ERC721/ERC721'
import { NFT, Metric } from '../types/schema'
import { isMint } from '../utils/nft'
import * as addresses from '../utils/addresses'
import * as categories from '../utils/categories'

export function handleTransfer(event: Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  // Category
  let address = event.address.toHexString()
  let category = ''
  if (address == addresses.LANDRegistry) {
    category = categories.PARCEL
  } else if (address == addresses.EstateRegistry) {
    category = categories.ESTATE
  } else if (
    address == addresses.ERC721Collection_exclusive_masks ||
    address == addresses.ERC721Collection_halloween_2019
  ) {
    category = categories.WEARABLE
  } else {
    throw new Error('Contract address not being monitored')
  }

  // TokenURI
  let tokenURI = ''
  if (category != categories.PARCEL) {
    let erc721 = ERC721.bind(event.address)
    let tokenURICallResult = erc721.try_tokenURI(event.params.tokenId)
    if (tokenURICallResult.reverted) {
      log.warning(
        'tokenURI reverted for tokenID: {} contract: {} category: {}',
        [event.params.tokenId.toString(), event.address.toHexString(), category]
      )
    } else {
      tokenURI = tokenURICallResult.value
    }
  }

  let id = category + '-' + event.params.tokenId.toString()
  let nft = new NFT(id)

  // Attributes
  nft.tokenId = event.params.tokenId
  nft.owner = event.params.to
  nft.contractAddress = event.address
  nft.category = category
  nft.tokenURI = tokenURI

  nft.save()

  // Metrics
  if (isMint(event)) {
    let metric = Metric.load('all')
    if (metric == null) {
      metric = new Metric('all')
      metric.parcel = 0
      metric.estate = 0
      metric.wearable_halloween_2019 = 0
      metric.wearable_exclusive_masks = 0
    }

    if (address == addresses.LANDRegistry) {
      metric.parcel += 1
    } else if (address == addresses.EstateRegistry) {
      metric.estate += 1
    } else if (address == addresses.ERC721Collection_exclusive_masks) {
      metric.wearable_exclusive_masks += 1
    } else if (address == addresses.ERC721Collection_halloween_2019) {
      metric.wearable_halloween_2019 += 1
    }

    metric.save()
  }
}
