import { BigInt } from '@graphprotocol/graph-ts'
import { Wallet } from '../../entities/schema'

export function createWallet(id: string): void {
  let wallet = Wallet.load(id)

  if (wallet == null) {
    wallet = new Wallet(id)
    wallet.mana = BigInt.fromI32(0)
  }

  wallet.save()
}
