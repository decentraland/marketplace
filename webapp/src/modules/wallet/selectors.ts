import { getData } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../reducer'

export const getWallet = (state: RootState) => {
  const wallet = getData(state)
  return wallet ? { ...wallet, address: wallet.address.toLowerCase() } : null
}

export * from 'decentraland-dapps/dist/modules/wallet/selectors'
