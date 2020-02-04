import React, { useCallback, useEffect } from 'react'
import { Page, Loader, Blockie, Popup } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { PageHeader } from '../PageHeader'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NFTListPage } from '../NFTListPage'
import { NavigationTab } from '../Navigation/Navigation.types'
import { locations } from '../../modules/routing/locations'
import { View } from '../../modules/ui/types'
import { SearchOptions } from '../../modules/routing/search'
import { shortenAddress } from '../../modules/wallet/utils'
import { Props } from './AccountPage.types'
import './AccountPage.css'

const AccountPage = (props: Props) => {
  const { address, wallet, isConnecting, onNavigate } = props

  const isCurrentAccount = address === undefined

  const handleOnNavigate = useCallback(
    (options?: SearchOptions) =>
      onNavigate(
        isCurrentAccount
          ? locations.currentAccount(options)
          : locations.account(address, options)
      ),
    [isCurrentAccount, address, onNavigate]
  )

  const renderNFTListPage = (address: string) => (
    <NFTListPage
      address={address}
      defaultOnlyOnSale={false}
      view={View.ACCOUNT}
      onNavigate={handleOnNavigate}
    />
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
        activeTab={isCurrentAccount ? NavigationTab.ACCOUNT : undefined}
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
          renderNFTListPage(wallet.address)
        )
      ) : (
        renderNFTListPage(address!)
      )}
      <Footer />
    </div>
  )
}

export default React.memo(AccountPage)
