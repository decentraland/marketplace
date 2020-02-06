import { BigInt } from '@graphprotocol/graph-ts'
import { NameRegistered } from '../entities/DCLRegistrar/DCLRegistrar'
import { ENS } from '../entities/schema'
import { getNFTId } from '../modules/nft'
import * as categories from '../modules/category/categories'
import * as addresses from '../data/addresses'

export function handleNameRegistered(event: NameRegistered): void {
  let tokenId = BigInt.fromUnsignedBytes(event.params._labelHash)

  let id = getNFTId(categories.ENS, addresses.DCLRegistrar, tokenId.toString())

  let ens = new ENS(id)
  ens.tokenId = tokenId
  ens.owner = event.params._caller.toHex()
  ens.caller = event.params._caller
  ens.beneficiary = event.params._beneficiary
  ens.labelHash = event.params._labelHash
  ens.subdomain = event.params._subdomain
  ens.createdAt = event.params._createdDate
  ens.save()
}
