import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { useEffect } from 'react'
import { locations } from '../modules/routing/locations'

interface UseRequireConnectProps {
  addressInUrl?: string
  wallet: Wallet | null
  isConnecting: boolean
  pathname?: string
  search?: string
  onRedirect?: (path: string) => void
  onNavigate?: (path: string) => void
}

export const useRequireConnect = ({
  addressInUrl,
  wallet,
  isConnecting,
  pathname,
  search,
  onRedirect,
  onNavigate
}: UseRequireConnectProps) => {
  // Redirect to signIn if trying to access current account without a wallet
  useEffect(() => {
    const isSignInRequired = !isConnecting && !wallet

    if (pathname && search && onNavigate) {
      // Check for Bids.tsx
      if (isSignInRequired) {
        onNavigate(locations.signIn(`${pathname}${search}`))
      }
    } else if (addressInUrl && onRedirect) {
      // Check for AccountPage.tsx
      if (isSignInRequired) {
        onRedirect(locations.signIn())
      }
    } else if (onRedirect) {
      // Check for other routes
      if (isSignInRequired) {
        onRedirect(locations.signIn())
      }
    }
  }, [
    addressInUrl,
    isConnecting,
    wallet,
    pathname,
    search,
    onNavigate,
    onRedirect
  ])
}
