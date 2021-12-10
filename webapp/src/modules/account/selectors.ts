import { createSelector } from 'reselect'
import { createMatchSelector } from 'connected-react-router'

import { RootState } from '../reducer'
import { locations } from '../routing/locations'

import { ethers } from 'ethers'
import { Address } from 'web3x/address'

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
  const provider = await ethers.getDefaultProvider()
  await provider.getResolver(address).then((res) => {
    console.log('res', res)
    if (res) {
      parsedAddress = res.address?.toString()!
      console.log('parsed address', parsedAddress)
    }
  })
  return parsedAddress
}

export const checkValidAddress = (address: string) => {
  return Address.isAddress(address)
}
