import React, { useEffect, useMemo, useState } from 'react'
import { utils } from 'ethers'
import { Page, Loader } from 'decentraland-ui'
import { isENSAddress, resolveENSname } from '../../modules/wallet/utils'
import { View } from '../../modules/ui/types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { AssetBrowse } from '../AssetBrowse'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { locations } from '../../modules/routing/locations'
import { Props } from './AccountPage.types'
import AccountBanner from './AccountBanner'
import './AccountPage.css'

const AccountPage = ({
  addressInUrl,
  vendor,
  wallet,
  isConnecting,
  isFullscreen,
  viewAsGuest,
  onRedirect
}: Props) => {
  const preloadedAddress = addressInUrl || wallet?.address
  const isENS = preloadedAddress && isENSAddress(preloadedAddress)
  const [address, setAddress] = useState(
    preloadedAddress && !isENS ? preloadedAddress : null
  )

  const isCurrentAccount =
    (!addressInUrl || wallet?.address === addressInUrl) && !viewAsGuest

  // Redirect to signIn if trying to access current account without a wallet
  useEffect(() => {
    if (!addressInUrl && !isConnecting && !wallet) {
      onRedirect(locations.signIn())
    }
  }, [addressInUrl, isConnecting, wallet, onRedirect])

  // Redirect to root page if the address provided is not a valid one
  useEffect(() => {
    if (address && !utils.isAddress(address) && !isENS) {
      onRedirect(locations.root())
    }
  }, [address, isENS, onRedirect])

  // Resolves ENS name if needed
  useEffect(() => {
    let cancel = false
    const resolveAddress = async () => {
      if (preloadedAddress && isENS) {
        const resolvedAddress = await resolveENSname(preloadedAddress)
        if (!resolvedAddress) {
          onRedirect(locations.root())
          return
        }
        if (!cancel) setAddress(resolvedAddress)
      }
    }
    resolveAddress()
    return () => {
      cancel = true
    }
  }, [isENS, onRedirect, preloadedAddress])

  const content = useMemo(() => {
    if (!address) {
      // if there is preloadedAddress but not address, it's being resolved
      if (preloadedAddress || isConnecting) {
        return (
          <Page>
            <Loader size="massive" active />
          </Page>
        )
      } else {
        return null
      }
    }

    return (
      <>
        {!isCurrentAccount && <AccountBanner address={address} />}
        <AssetBrowse
          vendor={vendor}
          address={address}
          view={isCurrentAccount ? View.CURRENT_ACCOUNT : View.ACCOUNT}
          isFullscreen={Boolean(isFullscreen)}
        />
      </>
    )
  }, [
    address,
    isConnecting,
    isCurrentAccount,
    isFullscreen,
    preloadedAddress,
    vendor
  ])

  return (
    <div className="AccountPage">
      <Navbar isFullscreen />
      <Navigation
        isFullscreen={!isCurrentAccount || isFullscreen}
        activeTab={isCurrentAccount ? NavigationTab.MY_STORE : undefined}
      />
      {content}
      <Footer isFullscreen={isFullscreen} />
    </div>
  )
}

export default React.memo(AccountPage)
