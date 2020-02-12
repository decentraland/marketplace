import React, { useCallback, useEffect } from 'react'
import { Page, Loader, Blockie, Popup } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { PageHeader } from '../PageHeader'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { locations } from '../../modules/routing/locations'
import { SearchOptions } from '../../modules/routing/search'
import { shortenAddress } from '../../modules/wallet/utils'
import { AddressNFTs } from './AddressNFTs'
import { Props } from './AccountPage.types'
import './AccountPage.css'

const AccountPage = (props: Props) => {
  const { address, wallet, isConnecting, onNavigate } = props

  const isCurrentAccount =
    address === undefined || (wallet && wallet.address === address)

  const handleOnNavigate = useCallback(
    (options?: SearchOptions) =>
      onNavigate(
        isCurrentAccount
          ? locations.currentAccount(options)
          : locations.account(address, options)
      ),
    [isCurrentAccount, address, onNavigate]
  )

  // Redirect to signIn if trying to access current account without a wallet
  useEffect(() => {
    if (isCurrentAccount && !isConnecting && !wallet) {
      onNavigate(locations.signIn())
    }
  }, [isCurrentAccount, isConnecting, wallet, onNavigate])

  return (
    <div className="AccountPage">
      <Navbar isFullscreen />
      <Navigation
        isFullscreen={!isCurrentAccount}
        activeTab={isCurrentAccount ? NavigationTab.MY_ASSETS : undefined}
      />
      {!isCurrentAccount ? (
        <PageHeader>
          <div>
            <Blockie seed={address!} scale={18} />
            <Popup
              content={address}
              position="top center"
              trigger={
                <div className="blockie-address secondary-text">
                  {shortenAddress(address!)}
                </div>
              }
            />
          </div>
        </PageHeader>
      ) : null}

      {isCurrentAccount ? (
        isConnecting || !wallet ? (
          <Page>
            <Loader size="massive" active />
          </Page>
        ) : (
          <AddressNFTs address={wallet.address} onNavigate={handleOnNavigate} />
        )
      ) : (
        <AddressNFTs address={address!} onNavigate={handleOnNavigate} />
      )}
      <Footer />
    </div>
  )
}

export default React.memo(AccountPage)
