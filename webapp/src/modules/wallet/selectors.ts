import { createSelector } from 'reselect'
import {
  getData,
  getAddress as baseGetAddress
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { RootState } from '../reducer'

export * from 'decentraland-dapps/dist/modules/wallet/selectors'

export const getWallet = createSelector<
  RootState,
  Wallet | null,
  Wallet | null
>(getData, wallet =>
  wallet ? { ...wallet, address: wallet.address.toLowerCase() } : null
)

export const getAddress = (state: RootState) => {
  const address = baseGetAddress(state)
  return address ? address.toLowerCase() : undefined
}
