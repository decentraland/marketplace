import { EthereumEvent } from '@graphprotocol/graph-ts'
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
