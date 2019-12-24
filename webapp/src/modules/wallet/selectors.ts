import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../reducer'
import { CONNECT_WALLET_REQUEST } from './actions'

export const getState = (state: RootState) => state.wallet
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export const isConnected = (state: RootState) => getData(state) !== null
export const isConnecting = (state: RootState) =>
  isLoadingType(getLoading(state), CONNECT_WALLET_REQUEST)

export const getNetwork = (state: RootState) =>
  isConnected(state) ? getData(state)!.network : null
export const getAddress = (state: RootState) =>
  isConnected(state) ? getData(state)!.address : null
export const getMana = (state: RootState) =>
  isConnected(state) ? getData(state)!.mana : null
export const getEth = (state: RootState) =>
  isConnected(state) ? getData(state)!.eth : null
