import { createSelector } from 'reselect'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { getData, getAddress as baseGetAddress, getNetworks } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { RootState } from '../reducer'

export const getWallet = createSelector<RootState, Wallet | null, Wallet | null>(getData, wallet =>
  wallet ? { ...wallet, address: wallet.address.toLowerCase() } : null
)

export const getAddress = (state: RootState) => {
  const address = baseGetAddress(state)
  return address ? address.toLowerCase() : undefined
}

/**
 * Gets the amount of MANA that the currently connected wallet has.
 * @param state The state.
 * @param network The network we want to check how much mana is in.
 * @returns The MANA that the current wallet has in the provided network or undefined if there's no wallet logged in.
 */
export const getMana = (state: RootState, network: Network.ETHEREUM | Network.MATIC): number | undefined => {
  return getNetworks(state)?.[network].mana
}
