import React, { useEffect } from 'react'
import { Page, Loader } from 'decentraland-ui'
import { Profile } from 'decentraland-dapps/dist/containers'

import { Navbar } from '../Navbar'
import { PageHeader } from '../PageHeader'
import { Footer } from '../Footer'
import { NFTBrowse } from '../NFTBrowse'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { locations } from '../../modules/routing/locations'
import { View } from '../../modules/ui/types'
import { Props } from './AccountPage.types'
import { Column } from '../Layout/Column'
import './AccountPage.css'

const AccountPage = (props: Props) => {
  const {
    address,
    vendor,
    wallet,
    isConnecting,
    onRedirect,
    isFullscreen
  } = props

  const isCurrentAccount =
    address === undefined || (wallet && wallet.address === address)

  // Redirect to signIn if trying to access current account without a wallet
  useEffect(() => {
    if (isCurrentAccount && !isConnecting && !wallet) {
      onRedirect(locations.signIn())
    }
  }, [isCurrentAccount, isConnecting, wallet, onRedirect])

  return (
    <div className="AccountPage">
      <Navbar isFullscreen />
      <Navigation
        isFullscreen={!isCurrentAccount || isFullscreen}
        activeTab={isCurrentAccount ? NavigationTab.MY_ASSETS : undefined}
      />
      {isCurrentAccount ? (
        isConnecting || !wallet ? (
          <Page>
            <Loader size="massive" active />
          </Page>
        ) : (
          <NFTBrowse
            vendor={vendor}
            address={wallet.address}
            view={View.ACCOUNT}
          />
        )
      ) : address !== undefined ? (
        <>
          <PageHeader>
            <Column>
              <Profile
                address={address}
                size="massive"
                imageOnly
                inline={false}
              />
              <div className="profile-name">
                <Profile address={address} textOnly inline={false} />
              </div>
            </Column>
          </PageHeader>

          <NFTBrowse vendor={vendor} address={address} view={View.ACCOUNT} />
        </>
      ) : null}
      <Footer isFullscreen={isFullscreen} />
    </div>
  )
}

export default React.memo(AccountPage)
