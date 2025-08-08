import { RootState } from '../reducer'
import { getAddress as getWalletAddress } from '../wallet/selectors'
import { getUserAddressFromUrlPath } from './hooks'
import { locations } from './locations'

export const getCurrentLocationAddress = (state: RootState, pathname: string) => {
  const walletAddress = getWalletAddress(state)
  const accountAddress = getUserAddressFromUrlPath(pathname)

  let address: string | undefined | null

  if (pathname === locations.currentAccount()) {
    address = walletAddress
  } else {
    address = accountAddress
  }

  return address ? address.toLowerCase() : undefined
}
