import { Transfer } from '../entities/templates/ERC721/ERC721'
import { NFT } from '../entities/schema'
import { isMint, getNFTId, getTokenURI } from '../modules/nft'
import { getCategory } from '../modules/category'
import { buildEstateFromNFT } from '../modules/estate'
import { buildMetricFromNFT } from '../modules/metric'
import { buildParcelFromNFT } from '../modules/parcel'
import { buildWearableFromNFT } from '../modules/wearable'
import { createWallet } from '../modules/wallet'
import * as addresses from '../modules/contract/addresses'
import * as categories from '../modules/category/categories'

export function handleTransfer(event: Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  let contractAddress = event.address.toHexString()
  let category = getCategory(contractAddress)
  let id = getNFTId(event.params.tokenId.toString(), category)

  let nft = new NFT(id)

  nft.tokenId = event.params.tokenId
  nft.owner = event.params.to.toHex()
  nft.contractAddress = event.address
  nft.category = category
  nft.updatedAt = event.block.timestamp

  if (contractAddress != addresses.LANDRegistry) {
    // The LANDRegistry contract does not have a tokenURI method
    nft.tokenURI = getTokenURI(event)
  }

  if (category == categories.PARCEL) {
    let parcel = buildParcelFromNFT(nft)
    parcel.save()
    nft.parcel = id
  } else if (category == categories.ESTATE) {
    let estate = buildEstateFromNFT(nft)
    estate.save()
    nft.estate = id
  } else if (category == categories.WEARABLE) {
    let wearable = buildWearableFromNFT(nft)
    if (wearable.id != '') {
      wearable.save()
      nft.wearable = id
    }
  }

  if (isMint(event)) {
    let metric = buildMetricFromNFT(nft)
    metric.save()
    nft.createdAt = event.block.timestamp
  }

  createWallet(event.params.to.toHex())

  nft.save()
}
