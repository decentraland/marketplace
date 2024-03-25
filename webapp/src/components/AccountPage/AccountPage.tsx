import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AddressProvider } from 'decentraland-dapps/dist/containers/AddressProvider'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Page, Loader, Center } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { View } from '../../modules/ui/types'
import { AssetBrowse } from '../AssetBrowse'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import AccountBanner from './AccountBanner'
import { Props } from './AccountPage.types'
import './AccountPage.css'

const AccountPage = ({ addressInUrl, vendor, wallet, isConnecting, isFullscreen, viewAsGuest, onRedirect }: Props) => {
  const isCurrentAccount = (!addressInUrl || wallet?.address === addressInUrl) && !viewAsGuest
  const { pathname, search } = useLocation()

  // Redirect to signIn if trying to access current account without a wallet
  useEffect(() => {
    if (!addressInUrl && !isConnecting && !wallet) {
      onRedirect(locations.signIn(`${pathname}${search}`))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressInUrl, isConnecting, wallet, onRedirect])

  return (
    <div className="AccountPage">
      <Navbar />
      <Navigation activeTab={isCurrentAccount ? NavigationTab.MY_STORE : undefined} />
      <AddressProvider input={addressInUrl || wallet?.address || ''}>
        {({ address, isLoading, error }) => (
          <>
            {isLoading || isConnecting ? (
              <Page>
                <Loader size="massive" active />
              </Page>
            ) : error ? (
              <Page>
                <Center>
                  <p className="secondary-text">{t(`address.${error}`)}</p>
                </Center>
              </Page>
            ) : address ? (
              <>
                {!isCurrentAccount ? <AccountBanner address={address} /> : null}
                <AssetBrowse vendor={vendor} address={address} view={isCurrentAccount ? View.CURRENT_ACCOUNT : View.ACCOUNT} />
              </>
            ) : null}
          </>
        )}
      </AddressProvider>
      <Footer isFullscreen={isFullscreen} />
    </div>
  )
}

export default React.memo(AccountPage)
