import React, { useEffect, useMemo } from 'react'
import { Page, Loader } from 'decentraland-ui'
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
  const address = addressInUrl || wallet?.address

  const isCurrentAccount =
    (!addressInUrl || wallet?.address === addressInUrl) && !viewAsGuest

  // Redirect to signIn if trying to access current account without a wallet
  useEffect(() => {
    if (!addressInUrl && !isConnecting && !wallet) {
      onRedirect(locations.signIn())
    }
  }, [addressInUrl, isConnecting, wallet, onRedirect])

  const content = useMemo(() => {
    if (!address) {
      if (isConnecting) {
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
  }, [address, isConnecting, isCurrentAccount, isFullscreen, vendor])

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
