import { Transfer } from '../entities/templates/ERC721/ERC721'
import { NFT } from '../entities/schema'
import { isMint, getNFTId, getTokenURI } from '../modules/nft'
import { getCategory } from '../modules/category'
// import { buildEstateFromNFT, getEstateImage } from '../modules/estate'
// import { buildCountFromNFT } from '../modules/count'
// import { buildParcelFromNFT, getParcelImage } from '../modules/parcel'
// import { buildWearableFromNFT, getWearableImage } from '../modules/wearable'
import { buildENSFromNFT } from '../modules/ens'
import { createWallet } from '../modules/wallet'
import * as categories from '../modules/category/categories'
import * as addresses from '../data/addresses'

import { NameRegistered } from '../entities/DCLRegistrar/DCLRegistrar'
import { NameRegistration } from '../entities/schema'

export function handleNameRegistered(event: NameRegistered): void {
  let nameRegistered = new NameRegistration(
    event.params._labelHash.toHexString()
  )
  nameRegistered.caller = event.params._caller
  nameRegistered.beneficiary = event.params._beneficiary
  nameRegistered.labelHash = event.params._labelHash
  nameRegistered.subdomain = event.params._subdomain
  nameRegistered.createdAt = event.params._createdDate
  nameRegistered.save()
}

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

  if (isMint(event)) {
    nft.createdAt = event.block.timestamp

    /*if (category == categories.PARCEL) {
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
    }*/ if (
      category == categories.ENS
    ) {
      let ens = buildENSFromNFT(nft)
      ens.save()
      nft.ens = ens.id
    }

    // let metric = buildCountFromNFT(nft)
    // metric.save()
  }

  createWallet(event.params.to.toHex())

  nft.save()
}
