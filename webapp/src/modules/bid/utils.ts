import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { MANA } from '../../contracts/MANA'
import { contractAddresses } from '../contract/utils'
import { getAddress } from '../wallet/selectors'
import { store } from '../store'
import { RootState } from '../reducer'
import { Bid } from './types'

export async function isInsufficientMANA(bid: Bid) {
  try {
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }
    const mana = new MANA(eth, Address.fromString(contractAddresses.MANAToken))

    // TODO: Remove store from here, receive address as argument
    const address = getAddress(store.getState() as RootState)
    if (!address) {
      throw new Error('Invalid address. Wallet must be connected.')
    }

    const balance = await mana.methods
      .balanceOf(Address.fromString(bid.bidder))
      .call()

    return +balance < +bid.price
  } catch (error) {
    console.warn(error.message)
  }
  return false
}

export function checkFingerprint(bid: Bid, fingerprint: string | undefined) {
  if (fingerprint && bid.fingerprint) {
    return fingerprint === bid.fingerprint
  }
  return true
}

export function toBidObject(bids: Bid[]) {
  return bids.reduce((obj, bid) => {
    obj[bid.id] = bid
    return obj
  }, {} as Record<string, Bid>)
}
