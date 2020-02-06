import { BigInt } from '@graphprotocol/graph-ts'
import { NameRegistered } from '../entities/DCLRegistrar/DCLRegistrar'
import { ENS } from '../entities/schema'
import { getNFTId } from '../modules/nft'

import * as categories from '../modules/category/categories'
import * as addresses from '../data/addresses'

export function handleNameRegistered(event: NameRegistered): void {
  let tokenId = BigInt.fromUnsignedBytes(event.params._labelHash)
  let tokenId2 = BigInt.fromUnsignedBytes(event.params._labelHash)
  let tokenId3 = BigInt.fromUnsignedBytes(event.params._labelHash)

  let id = getNFTId(categories.ENS, addresses.DCLRegistrar, tokenId.toString())

  let nameRegistered = new ENS(id)
  nameRegistered.caller = event.params._caller
  nameRegistered.beneficiary = event.params._beneficiary
  nameRegistered.labelHash = event.params._labelHash
  nameRegistered.subdomain = event.params._subdomain
  nameRegistered.createdAt = event.params._createdDate

  nameRegistered.tokenId = tokenId
  nameRegistered.tokenId2 = tokenId2
  nameRegistered.tokenId3 = tokenId3

  nameRegistered.save()
}
