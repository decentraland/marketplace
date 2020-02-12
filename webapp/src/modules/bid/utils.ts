import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { Bid } from './types'
import { MANA } from '../../contracts/MANA'
import { contractAddresses } from '../contract/utils'
import { getAddress } from '../wallet/selectors'
import { store } from '../store'
import { RootState } from '../reducer'

export async function isInsufficientMANA(bid: Bid) {
  try {
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }
    const mana = new MANA(eth, Address.fromString(contractAddresses.MANAToken))
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
