import { Transfer } from '../entities/templates/ERC721/ERC721'
import { NFT } from '../entities/schema'
import { isMint, getNFTId, getTokenURI } from '../modules/nft'
import { getCategory } from '../modules/category'
import { buildEstateFromNFT, getEstateImage } from '../modules/estate'
import { buildCountFromNFT } from '../modules/count'
import { buildParcelFromNFT, getParcelImage } from '../modules/parcel'
import { buildWearableFromNFT, getWearableImage } from '../modules/wearable'
import { createWallet } from '../modules/wallet'
import * as categories from '../modules/category/categories'
import * as addresses from '../data/addresses'

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
    nft.image = getParcelImage(parcel)
  } else if (category == categories.ESTATE) {
    let estate = buildEstateFromNFT(nft)
    estate.save()
    nft.estate = id
    nft.image = getEstateImage(estate)
  } else if (category == categories.WEARABLE) {
    let wearable = buildWearableFromNFT(nft)
    if (wearable.id != '') {
      wearable.save()
      nft.wearable = id
      nft.name = wearable.name
      nft.image = getWearableImage(wearable)
    }
  }

  if (isMint(event)) {
    let metric = buildCountFromNFT(nft)
    metric.save()
    nft.createdAt = event.block.timestamp
  }

  createWallet(event.params.to.toHex())

  nft.save()
}
