import { BigInt } from '@graphprotocol/graph-ts'
import { Mint, Burn, Transfer } from '../entities/ManaToken/ManaToken'
import { Wallet } from '../entities/schema'

export function handleMint(event: Mint): void {
  let walletId = event.params.to.toHex()
  let wallet = Wallet.load(walletId)
  if (wallet == null) {
    wallet = new Wallet(walletId)
    wallet.mana = BigInt.fromI32(0)
  }
  wallet.mana = wallet.mana.plus(event.params.amount)
  wallet.save()
}

export function handleBurn(event: Burn): void {
  let walletId = event.params.burner.toHex()
  let wallet = Wallet.load(walletId)
  if (wallet == null) {
    wallet = new Wallet(walletId)
    wallet.mana = BigInt.fromI32(0)
  }
  wallet.mana = wallet.mana.minus(event.params.value)
  wallet.save()
}

export function handleTransfer(event: Transfer): void {
  let walletToID = event.params.to.toHex()
  let walletTo = Wallet.load(walletToID)
  if (walletTo == null) {
    walletTo = new Wallet(walletToID)
    walletTo.mana = BigInt.fromI32(0)
  }
  walletTo.mana = walletTo.mana.plus(event.params.value)
  walletTo.save()

  let walletFromID = event.params.from.toHex()
  let walletFrom = Wallet.load(walletFromID)
  if (walletFrom == null) {
    walletFrom = new Wallet(walletFromID)
    walletFrom.mana = BigInt.fromI32(0)
  }
  walletFrom.mana = walletFrom.mana.minus(event.params.value)
  walletFrom.save()
}
