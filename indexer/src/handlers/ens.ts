import { NameRegistered } from '../entities/DCLRegistrar/DCLRegistrar'
import { ENS, NFT } from '../entities/schema'
import { getNFTId } from '../modules/nft'
import { getTokenIdFromLabelHash } from '../modules/ens'
import { createOrLoadAccount } from '../modules/account'
import { toLowerCase } from '../modules/utils'
import * as categories from '../modules/category/categories'
import * as addresses from '../data/addresses'

export function handleNameRegistered(event: NameRegistered): void {
  let tokenId = getTokenIdFromLabelHash(event.params._labelHash)

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

  let nft = NFT.load(id)
  nft.name = ens.subdomain
  nft.searchText = toLowerCase(ens.subdomain)
  nft.save()

  createOrLoadAccount(event.params._caller)
}
