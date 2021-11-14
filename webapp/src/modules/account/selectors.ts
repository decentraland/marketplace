import { createSelector } from 'reselect'
import { createMatchSelector } from 'connected-react-router'

import { RootState } from '../reducer'
import { locations } from '../routing/locations'

import { Address } from 'web3x/address'
import { ENS } from 'web3x/ens'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { Eth } from 'web3x/eth'

export const getState = (state: RootState) => state.account
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error


const accountMatchSelector = createMatchSelector<
  RootState,
  { address: string }
>(locations.account(':address'))

export const getAddress = createSelector<
  RootState,
  ReturnType<typeof accountMatchSelector>,
  string | undefined
>(accountMatchSelector, match => match?.params.address?.toLowerCase())

export const parseAddress = async (address: string) => {
  if (address === undefined) {
    return undefined
  }
  var parsedAddress = address
  const provider = await getConnectedProvider()
  const eth = new Eth(provider!)
  const ens = new ENS(eth)
  await ens.getResolver(address).then((res) => {
    if (res.address?.toString() !== '0x0000000000000000000000000000000000000000') {
      parsedAddress = res.address?.toString()!
    }
  })
  return parsedAddress
}

export const checkValidAddress = (address: string) => {
  return Address.isAddress(address)
}