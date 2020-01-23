import { BigInt, Address } from '@graphprotocol/graph-ts'
import { Account } from '../../entities/schema'

export function createAccount(id: Address): void {
  let wallet = Account.load(id.toHex())

  if (wallet == null) {
    wallet = new Account(id.toHex())
    wallet.address = id
    wallet.mana = BigInt.fromI32(0)
  }

  wallet.save()
}
