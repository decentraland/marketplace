import {
  getData,
  getAddress as baseGetAddress
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../reducer'

export * from 'decentraland-dapps/dist/modules/wallet/selectors'

export const getWallet = (state: RootState) => {
  const wallet = getData(state)
  return wallet ? { ...wallet, address: wallet.address.toLowerCase() } : null
}

export const getAddress = (state: RootState) => {
  const address = baseGetAddress(state)
  return address ? address.toLowerCase() : undefined
}
