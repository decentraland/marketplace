import { Transfer } from '../entities/templates/ERC721/ERC721'
import { NFT, Parcel, Estate } from '../entities/schema'
import { isMint, buildId, getTokenURI } from '../modules/nft'
import { getCategory } from '../modules/category'
import { buildData, DataType } from '../modules/data'
import { upsertMetric } from '../modules/metric'
import { decodeTokenId } from '../modules/parcel'
import { upsertWearable } from '../modules/wearable'
import { createWallet } from '../modules/wallet'
import * as addresses from '../modules/contract/addresses'
import * as categories from '../modules/category/categories'

export function handleTransfer(event: Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  let contractAddress = event.address.toHexString()
  let category = getCategory(contractAddress)
  let id = buildId(event.params.tokenId.toString(), category)

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
    // TODO: Extract to parcel?
    let parcel = new Parcel(id)
    let coordinates = decodeTokenId(event.params.tokenId)

    parcel.x = coordinates[0]
    parcel.y = coordinates[1]
    parcel.tokenId = nft.tokenId
    parcel.owner = nft.owner
    parcel.save()

    nft.parcel = id
  } else if (category == categories.ESTATE) {
    // TODO: Extract to estate?
    let estate = new Estate(id)

    estate.tokenId = nft.tokenId
    estate.owner = nft.owner
    estate.parcels = []
    estate.size = 0
    estate.save()

    nft.estate = id
  } else if (category == categories.WEARABLE) {
    // TODO: use id as wearableId
    // TODO: Add warable owner
    // TODO: save wearable here
    let wearableId = upsertWearable(nft.tokenURI)
    if (wearableId != '') {
      nft.wearable = wearableId
    }
  }

  if (isMint(event)) {
    upsertMetric(contractAddress)
    nft.createdAt = event.block.timestamp
  }

  createWallet(event.params.to.toHex())

  nft.save()
}
