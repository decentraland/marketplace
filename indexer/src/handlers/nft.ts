import { log } from '@graphprotocol/graph-ts'
import { Transfer } from '../entities/templates/ERC721/ERC721'
import { NFT, Parcel, Estate, Order } from '../entities/schema'
import {
  isMint,
  getNFTId,
  getTokenURI,
  cancelActiveOrder,
  clearNFTOrderProperties
} from '../modules/nft'
import { getCategory } from '../modules/category'
import { buildEstateFromNFT, getEstateImage } from '../modules/estate'
import { buildCountFromNFT } from '../modules/count'
import {
  buildParcelFromNFT,
  getParcelImage,
  isInBounds
} from '../modules/parcel'
import {
  buildWearableFromNFT,
  getWearableImage,
  isWearableHead,
  isWearableAccessory
} from '../modules/wearable'
import { buildENSFromNFT } from '../modules/ens'
import { createAccount } from '../modules/wallet'
import * as categories from '../modules/category/categories'
import * as addresses from '../data/addresses'
import * as status from '../modules/order/status'

export function handleTransfer(event: Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  let contractAddress = event.address.toHexString()
  let category = getCategory(contractAddress)
  let id = getNFTId(
    category,
    event.address.toHexString(),
    event.params.tokenId.toString()
  )

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

  if (isMint(event)) {
    nft.createdAt = event.block.timestamp

    // We're defaulting "Estate size" to one to allow the frontend to search for `searchEstateSize_gt: 0`,
    // necessary because thegraph doesn't support complex queries and we can't do `OR` operations
    nft.searchEstateSize = 1

    nft.searchIsLand = false

    // We default the "in bounds" property for parcels and no-parcels alike so we can just add  `searchParcelIsInBounds: true`
    // to all queries
    nft.searchParcelIsInBounds = true

    if (category == categories.PARCEL) {
      let parcel = buildParcelFromNFT(nft)
      parcel.save()
      nft.parcel = id
      nft.image = getParcelImage(parcel)
      nft.searchIsLand = true
      nft.searchParcelIsInBounds = isInBounds(parcel.x, parcel.y)
      nft.searchParcelX = parcel.x
      nft.searchParcelY = parcel.y
    } else if (category == categories.ESTATE) {
      let estate = buildEstateFromNFT(nft)
      estate.save()
      nft.estate = id
      nft.image = getEstateImage(estate)
      nft.searchIsLand = true
      nft.searchEstateSize = estate.size
    } else if (category == categories.WEARABLE) {
      let wearable = buildWearableFromNFT(nft)
      if (wearable.id != '') {
        wearable.save()
        nft.wearable = id
        nft.name = wearable.name
        nft.image = getWearableImage(wearable)
        nft.searchIsWearableHead = isWearableHead(wearable)
        nft.searchIsWearableAccessory = isWearableAccessory(wearable)
        nft.searchWearableCategory = wearable.category
        nft.searchWearableBodyShapes = wearable.bodyShapes
        nft.searchWearableRarity = wearable.rarity
      }
    } else if (category == categories.ENS) {
      let ens = buildENSFromNFT(nft)
      ens.save()
      nft.ens = ens.id
    }

    let metric = buildCountFromNFT(nft)
    metric.save()
  } else {
    let oldNFT = NFT.load(id)
    if (cancelActiveOrder(oldNFT!, event.block.timestamp)) {
      nft = clearNFTOrderProperties(nft!)
    }
  }

  createAccount(event.params.to)

  nft.save()
}
