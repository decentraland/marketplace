import React, { useEffect } from 'react'
import { Page, Loader, Blockie, Popup } from 'decentraland-ui'
import { EtherscanLink } from 'decentraland-dapps/dist/containers'

import { Navbar } from '../Navbar'
import { PageHeader } from '../PageHeader'
import { Footer } from '../Footer'
import { NFTBrowse } from '../NFTBrowse'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { locations } from '../../modules/routing/locations'
import { View } from '../../modules/ui/types'
import { shortenAddress } from '../../modules/wallet/utils'
import { contractNames } from '../../modules/contract/utils'
import { Props } from './AccountPage.types'
import './AccountPage.css'

const AccountPage = (props: Props) => {
  const { address, vendor, wallet, isConnecting, onRedirect } = props

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
        isFullscreen={!isCurrentAccount}
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

          <NFTBrowse vendor={vendor} address={address} view={View.ACCOUNT} />
        </>
      ) : null}
      <Footer />
    </div>
  )
}

export default React.memo(AccountPage)
