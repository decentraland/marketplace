import React, { useCallback, useEffect } from 'react'
import { Page, Loader, Blockie, Popup } from 'decentraland-ui'
import { EtherscanLink } from 'decentraland-dapps/dist/containers'

import { Navbar } from '../Navbar'
import { PageHeader } from '../PageHeader'
import { Footer } from '../Footer'
import { NFTListPage } from '../NFTListPage'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { locations } from '../../modules/routing/locations'
import { SearchOptions } from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { shortenAddress } from '../../modules/wallet/utils'
import { contractNames } from '../../modules/contract/utils'
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
      {isCurrentAccount ? (
        isConnecting || !wallet ? (
          <Page>
            <Loader size="massive" active />
          </Page>
        ) : (
          <NFTListPage
            address={wallet.address}
            defaultOnlyOnSale={false}
            view={View.ACCOUNT}
            onNavigate={handleOnNavigate}
          />
        )
      ) : address !== undefined ? (
        <>
          <PageHeader>
            <div>
              <Blockie seed={address} scale={18} />
              <Popup
                content={address}
                position="top center"
                trigger={
                  <div className="blockie-address secondary-text">
                    {contractNames[address] ? (
                      <EtherscanLink
                        address={address}
                        txHash={''}
                        text={contractNames[address]}
                      />
                    ) : (
                      shortenAddress(address)
                    )}
                  </div>
                }
              />
            </div>
          </PageHeader>

          <NFTListPage
            address={address}
            defaultOnlyOnSale={false}
            view={View.ACCOUNT}
            onNavigate={handleOnNavigate}
          />
        </>
      ) : null}
      <Footer />
    </div>
  )
}

export default React.memo(AccountPage)
