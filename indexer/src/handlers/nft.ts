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

  if (contractAddress != addresses.LANDRegistry) {
    // The LANDRegistry contract does not have a tokenURI method
    nft.tokenURI = getTokenURI(event)
  }

  if (category == categories.WEARABLE) {
    let wearableId = upsertWearable(nft.tokenURI)
    if (wearableId != '') {
      nft.wearable = wearableId
    }
  }

  if (isMint(event)) {
    upsertMetric(contractAddress)
    nft.createdAt = event.block.timestamp
  } else {
    nft.updatedAt = event.block.timestamp
  }

  createWallet(event.params.to.toHex())

  nft.save()
}
