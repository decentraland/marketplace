import { log, BigInt, Value } from '@graphprotocol/graph-ts'
import { Transfer } from '../entities/templates/ERC721/ERC721'
import { NFT } from '../entities/schema'
import { isMint, getNFTId, getTokenURI } from '../modules/nft'
import { getCategory } from '../modules/category'
import { buildENSFromNFT } from '../modules/ens'
import { createWallet } from '../modules/wallet'
import * as categories from '../modules/category/categories'
import * as addresses from '../data/addresses'

import { NameRegistered } from '../entities/DCLRegistrar/DCLRegistrar'
import { ENS } from '../entities/schema'

export function handleNameRegistered(event: NameRegistered): void {
  let tokenId = BigInt.fromUnsignedBytes(event.params._labelHash)

  let id = getNFTId(tokenId.toString(), categories.ENS)

  let nameRegistered = new ENS(id)
  nameRegistered.caller = event.params._caller
  nameRegistered.beneficiary = event.params._beneficiary
  nameRegistered.labelHash = event.params._labelHash
  nameRegistered.subdomain = event.params._subdomain
  nameRegistered.createdAt = event.params._createdDate

  nameRegistered.tokenId = tokenId
  // nameRegistered.tokenId2 = tokenId2
  // nameRegistered.tokenId3 = tokenId3

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

    if (category == categories.ENS) {
      let ens = buildENSFromNFT(nft)
      ens.save()
      nft.ens = ens.id
    }
  }

  createWallet(event.params.to.toHex())

  nft.save()
}
