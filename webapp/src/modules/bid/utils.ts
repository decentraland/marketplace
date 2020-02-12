import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import addDays from 'date-fns/addDays'
import dateFnsFormat from 'date-fns/format'
import { Bid } from './types'
import { MANA } from '../../contracts/MANA'
import { contractAddresses } from '../contract/utils'
import { getAddress } from '../wallet/selectors'
import { store } from '../store'
import { RootState } from '../reducer'

export const DEFAULT_EXPIRATION_IN_DAYS = 30
export const INPUT_FORMAT = 'yyyy-MM-dd'
export const DEFAULT_EXPIRATION_DATE = dateFnsFormat(
  addDays(new Date(), DEFAULT_EXPIRATION_IN_DAYS),
  INPUT_FORMAT
)

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

    console.log(+balance, +bid.price, +balance < +bid.price)
    return +balance < +bid.price
  } catch (error) {
    console.warn(error.message)
  }
  return false
}
